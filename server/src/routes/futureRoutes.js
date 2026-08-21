import { Router } from 'express';
export const futureRoute = (label) => { const router = Router(); router.all('*', (req, res) => res.status(501).json({ message: `${label} endpoints are planned for a later stage.` })); return router; };
