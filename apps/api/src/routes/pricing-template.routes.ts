import express, { Request, Response } from 'express';
import { PricingTemplate } from '@shabu/database';

const router = express.Router();

// Get all templates
router.get('/', async (req: Request, res: Response) => {
    try {
        const templates = await PricingTemplate.find().sort({ createdAt: -1 });
        res.json(templates);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

// Get single template
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const template = await PricingTemplate.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }
        res.json(template);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch template' });
    }
});

// Create template
router.post('/', async (req: Request, res: Response) => {
    try {
        const template = new PricingTemplate({
            ...req.body,
            // Normally get storeId from auth middleware, using body for now
        });
        await template.save();
        res.status(201).json(template);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create template' });
    }
});

// Update template
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const template = await PricingTemplate.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }
        res.json(template);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update template' });
    }
});

// Delete template
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const template = await PricingTemplate.findByIdAndDelete(req.params.id);
        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }
        res.json({ message: 'Template deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete template' });
    }
});

export default router;
