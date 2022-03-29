import { Request, Response } from "express";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import { VehicleService } from "@services/VehicleService";
import { vehicleDecoder } from "@models/VehicleModel";
//import { logger } from "@utils/winston";
import { AuthService } from "@services/AuthService";
import { extractPaginateOptions } from "@utils/pagination";
import httpErrors from "http-errors";
import { AuthController } from "@controllers/AuthController";

@provide(VehicleController)
export class VehicleController {

    @inject(AuthService) private authService: AuthService;
    @inject(AuthController) private authController: AuthController;
    @inject(VehicleService) private vehicleService: VehicleService;

    // public async create(req: Request, res: Response) {
    //     //await this.authService.adminOnly(req);

    //     const vehicle = vehicleDecoder.runWithException(req.body);
    //     const saved = await this.vehicleService.save(vehicle);

    //     return res.status(201).send(saved);
    // }

    public async create(req: Request, res: Response) {
        const vehicle = vehicleDecoder.runWithException(req.body);
        vehicle.user_id = (await this.authController.obtain_id(req, res)).id_utente;
        const saved = await this.vehicleService.save(vehicle);

        return res.status(201).send(saved);
    }

    public async find(req: Request, res: Response) {
        //await this.authService.adminOnly(req);
        let richiesta = req.body
        
        if (richiesta === undefined) {
            richiesta = {};
        } else if (richiesta.page === undefined) {
            richiesta.page = "1";
        }

        const pagination = extractPaginateOptions(richiesta);

        const result = await this.vehicleService.paginate(richiesta.query, pagination);  //req.body.query == undefined
        const user_id = (await this.authController.obtain_id(req, res)).id_utente;
        const is_admin = (await this.authController.obtain_id(req, res)).is_admin;
        
        result.docs = result.docs.filter(( obj ) => {
            //return (obj.isVisible === true);
            //console.log(obj.isVisible === true && obj.user_id === await this.authController.obtain_id(req, res)).id_utente;
            return (obj.isVisible === true && (obj.user_id === user_id || is_admin))
        });

        return res.status(200).send(result);
    }

    public async findInTrash(req: Request, res: Response) {
        let richiesta = req.body
        
        if (richiesta === undefined) {
            richiesta = {};
        } else if (richiesta.page === undefined) {
            richiesta.page = "1";
        }
        
        //await this.authService.adminOnly(req);
        const pagination = extractPaginateOptions(richiesta);

        const result = await this.vehicleService.paginate(richiesta.query, pagination);  //req.body.query == undefined
        const user_id = (await this.authController.obtain_id(req, res)).id_utente;
        const is_admin = (await this.authController.obtain_id(req, res)).is_admin;

        result.docs = result.docs.filter(( obj ) => {
            return (obj.isVisible === false && (obj.user_id === user_id || is_admin))
        });

        return res.status(200).send(result);
    }

    public async findById(req: Request, res: Response) {
        if (!req.params.id) {
            throw new httpErrors.BadRequest("Missing id in path params");
        }

        //await this.authService.adminOnly(req);
        const obj = await this.vehicleService.findById(req.params.id);
        const user_id = (await this.authController.obtain_id(req, res)).id_utente;
        const is_admin = (await this.authController.obtain_id(req, res)).is_admin;

        if (obj.user_id !== user_id && !is_admin){
            return res.status(401);
        }

        return res.status(200).send(obj);
    }

    public async updateById(req: Request, res: Response) {
        if (!req.params.id) {
            throw new httpErrors.BadRequest("Missing id in path params");
        }

        //await this.authService.adminOnly(req);
        const obj = await this.vehicleService.findById(req.params.id);
        const user_id = (await this.authController.obtain_id(req, res)).id_utente;
        const is_admin = (await this.authController.obtain_id(req, res)).is_admin;

        if (obj.user_id !== user_id && !is_admin){
            return res.status(401);
        }
        const updated = await this.vehicleService.updateById(req.params.id, req.body);

        return res.status(200).send(updated);
    }

    public async safedelById(req: Request, res: Response) {
        if (!req.params.id) {
            throw new httpErrors.BadRequest("Missing id in path params");
        }

        const obj = await this.vehicleService.findById(req.params.id);
        const user_id = (await this.authController.obtain_id(req, res)).id_utente;
        const is_admin = (await this.authController.obtain_id(req, res)).is_admin;

        if (obj.user_id !== user_id && !is_admin){
            return res.status(401);
        }

        const safedel = {isVisible: false};
        const safedeleted = await this.vehicleService.updateById(req.params.id, safedel);

        return res.status(200).send(safedeleted);
    }

    public async restoreById(req: Request, res: Response) {
        if (!req.params.id) {
            throw new httpErrors.BadRequest("Missing id in path params");
        }
        
        const obj = await this.vehicleService.findById(req.params.id);
        const user_id = (await this.authController.obtain_id(req, res)).id_utente;
        const is_admin = (await this.authController.obtain_id(req, res)).is_admin;

        if (obj.user_id !== user_id && !is_admin){
            return res.status(401);
        }

        const restore = {isVisible: true};
        const restored = await this.vehicleService.updateById(req.params.id, restore);

        return res.status(200).send(restored);
    }

    // public async updateMe(req: Request, res: Response) {
    //     const user = await this.authService.getUserFromRequest(req);
    //     if (req.body.password) {
    //         throw new httpErrors.BadRequest("Please use /update/password to update your password.");
    //     }
    //     if (req.body.roles && !user.isAdmin()) {
    //         throw new httpErrors.Forbidden("You can't update forbidden fields. Only admins can.");
    //     }

    //     const updated = await this.userService.updateById(user.id, req.body);
    //     return res.status(200).send(updated);
    // }

    // public async updatePassword(req: Request, res: Response) {
    //     const updatePassword = userPasswordUpdateDecoder.runWithException(req.body);
    //     const user = await this.authService.getUserFromRequest(req);

    //     logger.info(`User ${user.username} is trying to update its password!`);
    //     await this.userService.updatePassword(user, updatePassword);

    //     return res.status(200).send({ message: "Password updated successfully" });
    // }

    public async deleteById(req: Request, res: Response) {
        if (!req.params.id) {
            throw new httpErrors.BadRequest("Missing id in path params");
        }

        const obj = await this.vehicleService.findById(req.params.id);
        const user_id = (await this.authController.obtain_id(req, res)).id_utente;
        const is_admin = (await this.authController.obtain_id(req, res)).is_admin;

        if (obj.user_id !== user_id && !is_admin){
            return res.status(401);
        }

        //await this.authService.adminOnly(req);
        const deleted = await this.vehicleService.deleteById(req.params.id);

        return res.status(200).send(deleted);
    }

}
