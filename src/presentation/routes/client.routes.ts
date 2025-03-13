import express, { Router, Request, Response } from 'express';
import { ClientController } from '../controllers/ClientController';

const router: Router = express.Router();

const clientController = new ClientController();

router.post('/', (req: Request, res: Response) => clientController.create(req, res));
router.get('/:id', (req: Request, res: Response) => clientController.getById(req, res));
router.put('/:id', (req: Request, res: Response) => clientController.update(req, res));
router.delete('/:id', (req: Request, res: Response) => clientController.delete(req, res));
router.get('/', (req: Request, res: Response) => clientController.list(req, res));

export default router;
