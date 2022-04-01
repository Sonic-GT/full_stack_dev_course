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
            try {
                this.vehicleController.create(req, res); //Modifica register => create
            } catch (error) {
                res.status(error.statusCode).json({error})
            }
        });

        app.post("/vehicle/query", passport.authenticate("jwt", {session: false}), (req, res) => {
            try {
                this.vehicleController.find(req, res);
            } catch (error) {
                res.status(error.statusCode).json({error})
            }
        });

        app.post("/vehicle/trash", passport.authenticate("jwt", {session: false}), (req, res) => {
            try {
                this.vehicleController.findInTrash(req, res);
            } catch (error) {
                res.status(error.statusCode).json({error})
            }
        });
        
        app.post("/vehicle/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
            try {
                this.vehicleController.findById(req, res);
            } catch (error) {
                res.status(error.statusCode).json({error})
            }
        });

        app.put("/vehicle/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
            try {
                this.vehicleController.updateById(req, res);
            } catch (error) {
                res.status(error.statusCode).json({error})
            }
        });

        app.put("/vehicle/safe_del/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
            try {
                this.vehicleController.safedelById(req, res);
            } catch (error) {
                res.status(error.statusCode).json({error})
            }
        })

        app.put("/vehicle/restore/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
            try {
                this.vehicleController.restoreById(req, res);
            } catch (error) {
                res.status(error.statusCode).json({error})
            }
        })

        // app.post("/user/register", (req, res) => {
        //     this.userController.updatePassword(req, res);
        // });

        // app.put("/user/update/me", passport.authenticate("jwt"), (req, res) => {
        //     this.userController.updateMe(req, res);
        // });

        app.delete("/vehicle/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
            try {
                this.vehicleController.deleteById(req, res);
            } catch (error) {
                res.status(error.statusCode).json({error})
            }
        });
    }

}
