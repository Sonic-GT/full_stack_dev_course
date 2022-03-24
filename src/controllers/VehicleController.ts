import { Request, Response } from "express";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import { VehicleService } from "@services/VehicleService";
import { vehicleDecoder } from "@models/VehicleModel";
//import { logger } from "@utils/winston";
import { AuthService } from "@services/AuthService";
import { extractPaginateOptions } from "@utils/pagination";
import httpErrors from "http-errors";

@provide(VehicleController)
export class VehicleController {

    @inject(AuthService) private authService: AuthService;
    @inject(VehicleService) private vehicleService: VehicleService;

    // public async create(req: Request, res: Response) {
    //     //await this.authService.adminOnly(req);

    //     const vehicle = vehicleDecoder.runWithException(req.body);
    //     const saved = await this.vehicleService.save(vehicle);

    //     return res.status(201).send(saved);
    // }

    public async create(req: Request, res: Response) {
        const vehicle = vehicleDecoder.runWithException(req.body);
        const saved = await this.vehicleService.save(req.body);

        return res.status(201).send(saved);
    }

    public async find(req: Request, res: Response) {
        //await this.authService.adminOnly(req);
        const pagination = extractPaginateOptions(req.body);
        
        const result = await this.vehicleService.paginate(req.body.query, pagination);
        return res.status(200).send(result);
    }

    public async findById(req: Request, res: Response) {
        if (!req.params.id) {
            throw new httpErrors.BadRequest("Missing id in path params");
        }

        //await this.authService.adminOnly(req);
        const obj = await this.vehicleService.findById(req.params.id);

        return res.status(200).send(obj);
    }

    public async updateById(req: Request, res: Response) {
        if (!req.params.id) {
            throw new httpErrors.BadRequest("Missing id in path params");
        }

        //await this.authService.adminOnly(req);
        const updated = await this.vehicleService.updateById(req.params.id, req.body);

        return res.status(200).send(updated);
    }

    public async safedelById(req: Request, res: Response) {

        const safedel = {isVisible: false};
        const safedeleted = await this.vehicleService.updateById(req.params.id, safedel);

        return res.status(200).send(safedeleted);
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

        //await this.authService.adminOnly(req);
        const deleted = await this.vehicleService.deleteById(req.params.id);

        return res.status(200).send(deleted);
    }

}
