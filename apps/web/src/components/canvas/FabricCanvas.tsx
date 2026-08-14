"use client";

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useCustomizerStore } from "@/store/useCustomizerStore";

interface FabricCanvasProps {
    logicalWidth: number;
    logicalHeight: number;
    printArea?: { x: number; y: number; width: number; height: number };
}

export function FabricCanvas({ logicalWidth, logicalHeight, printArea }: FabricCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasElRef = useRef<HTMLCanvasElement>(null);
    const [fabricInstance, setFabricInstance] = useState<fabric.Canvas | null>(null);
    const { setCanvas, setActiveObject } = useCustomizerStore();

    useEffect(() => {
        if (!canvasElRef.current || !containerRef.current) return;

        // Initialize Fabric Canvas
        const canvas = new fabric.Canvas(canvasElRef.current, {
            preserveObjectStacking: true,
            selectionBorderColor: "#3b82f6",
            selectionColor: "rgba(59, 130, 246, 0.1)",
            backgroundColor: "transparent",
        });

        setFabricInstance(canvas);

        // Initial Resize
        const resizeCanvas = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;

            // Calculate safe scale to fit logical dimensions into the container
            const scaleX = containerWidth / logicalWidth;
            const scaleY = containerHeight / logicalHeight;
            // Wait, let's just make it "Fit to screen"
            const optimalZoom = Math.min(scaleX, scaleY);

            canvas.setDimensions({
                width: logicalWidth * optimalZoom,
                height: logicalHeight * optimalZoom,
            });
            canvas.setZoom(optimalZoom);
        };

        resizeCanvas();
        const ro = new ResizeObserver(resizeCanvas);
        ro.observe(containerRef.current);

        setCanvas(canvas);

        // Bind selection events
        const updateSelection = () => {
            const activeObj = canvas.getActiveObject();
            if (activeObj) {
                // Ensure object has an ID
                if (!(activeObj as any).id) {
                    (activeObj as any).id = Math.random().toString(36).substring(7);
                }
                setActiveObject((activeObj as any).id, activeObj.type || null);
            } else {
                setActiveObject(null, null);
            }
        };

        canvas.on('selection:created', updateSelection);
        canvas.on('selection:updated', updateSelection);
        canvas.on('selection:cleared', updateSelection);
        // Also track modification so UI can update properties (e.g. scale changes)
        canvas.on('object:modified', () => {
            const activeObj = canvas.getActiveObject();
            if (activeObj) {
                setActiveObject(null, null);
                setTimeout(() => setActiveObject((activeObj as any).id, activeObj.type || null), 0);
            }
        });

        // Keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                // Prevent deleting if typing in an input
                if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
                const activeObj = canvas.getActiveObject();
                if (activeObj && !(activeObj as any).isEditing) {
                    canvas.remove(activeObj);
                    canvas.discardActiveObject();
                    canvas.requestRenderAll();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            ro.disconnect();
            window.removeEventListener('keydown', handleKeyDown);
            canvas.dispose();
            setCanvas(null);
        };
    }, [logicalWidth, logicalHeight]); // We don't depend on printArea to avoid reinitializing on every prop change. We'll handle printArea separately.

    // Apply clip path and bounds warning when instance or printArea changes
    useEffect(() => {
        if (!fabricInstance || !printArea) return;

        // Apply visual clipping path to the canvas, matching the print area precisely
        const clipRect = new fabric.Rect({
            originX: 'left',
            originY: 'top',
            left: logicalWidth * printArea.x,
            top: logicalHeight * printArea.y,
            width: logicalWidth * printArea.width,
            height: logicalHeight * printArea.height,
            absolutePositioned: true
        });

        // The warning system
        const checkBounds = (e: fabric.IEvent) => {
            const obj = e.target;
            if (!obj) return;
            const objBounds = obj.getBoundingRect(true, true);
            const printBounds = {
                left: clipRect.left! * fabricInstance.getZoom(),
                top: clipRect.top! * fabricInstance.getZoom(),
                right: (clipRect.left! + clipRect.width!) * fabricInstance.getZoom(),
                bottom: (clipRect.top! + clipRect.height!) * fabricInstance.getZoom()
            };

            const isOut = (
                objBounds.left > printBounds.right ||
                objBounds.left + objBounds.width < printBounds.left ||
                objBounds.top > printBounds.bottom ||
                objBounds.top + objBounds.height < printBounds.top
            );

            if (isOut) {
                // You could trigger a toast here
                obj.opacity = 0.5; // Visual hint that it's out of bounds
            } else {
                obj.opacity = 1;
            }
        };

        fabricInstance.on('object:moving', checkBounds);
        fabricInstance.on('object:modified', checkBounds);

        return () => {
            fabricInstance.off('object:moving', checkBounds);
            fabricInstance.off('object:modified', checkBounds);
        };
    }, [fabricInstance, printArea, logicalWidth, logicalHeight]);

    // Expose methods to global window for testing or easy hook access later
    // In a real app we'd use Zustand or a React Context
    useEffect(() => {
        if (fabricInstance) {
            (window as any).canvas = fabricInstance;
        }
    }, [fabricInstance]);

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center relative overflow-hidden bg-white shadow-xl ring-1 ring-slate-200">
            <canvas ref={canvasElRef} />

            {/* Visual Print Area Overlay (non-interactive) */}
            {printArea && (
                <div
                    className="absolute border-[2px] border-dashed border-blue-400/60 pointer-events-none select-none z-10"
                    style={{
                        left: `${printArea.x * 100}%`,
                        top: `${printArea.y * 100}%`,
                        width: `${printArea.width * 100}%`,
                        height: `${printArea.height * 100}%`,
                    }}
                >
                    <div className="absolute top-2 left-2 text-[10px] uppercase font-bold tracking-widest text-blue-500/60">
                        Print Safe Area
                    </div>
                </div>
            )}
        </div>
    );
}
