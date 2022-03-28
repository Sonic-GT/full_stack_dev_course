import Express from "express";
import { Route } from "./Route";
import { provide } from "inversify-binding-decorators";
import { VehicleController } from "@controllers/VehicleController";
import { inject } from "inversify";
import passport from "passport";

@provide(VehicleRoute)
export class VehicleRoute implements Route {

    @inject(VehicleController) private vehicleController: VehicleController;

    makeRoutes(app: Express.Application): void {
        
        // app.post("/vehicle", passport.authenticate("jwt"), (req, res) => {
        //     this.userController.create(req, res);
        // });

        app.post("/vehicle", passport.authenticate("jwt", {session: false}), (req, res) => {
            this.vehicleController.create(req, res); //Modifica register => create
        });

        app.post("/vehicle/query", passport.authenticate("jwt", {session: false}), (req, res) => {
            this.vehicleController.find(req, res);
        });

        app.post("/vehicle/trash", passport.authenticate("jwt", {session: false}), (req, res) => {
            this.vehicleController.findInTrash(req, res);
        });
        
        app.post("/vehicle/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
            this.vehicleController.findById(req, res);
        });

        app.put("/vehicle/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
            this.vehicleController.updateById(req, res);
        });

        app.put("/vehicle/safe_del/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
            this.vehicleController.safedelById(req, res);
        })

        app.put("/vehicle/restore/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
            this.vehicleController.restoreById(req, res);
        })

        // app.post("/user/register", (req, res) => {
        //     this.userController.updatePassword(req, res);
        // });

        // app.put("/user/update/me", passport.authenticate("jwt"), (req, res) => {
        //     this.userController.updateMe(req, res);
        // });

        app.delete("/vehicle/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
            this.vehicleController.deleteById(req, res);
        });
    }

}
