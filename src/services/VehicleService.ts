import { provide } from "inversify-binding-decorators";
import { VehicleModel, Vehicle, VehicleDocument } from "@models/VehicleModel";
//import { comparePasswords } from "@utils/crypto";
import { FilterQuery, PaginateOptions, PaginateResult, UpdateQuery } from "mongoose";
import { QueryOptions } from "@utils/pagination";
import { unmanaged } from "inversify";
//import httpErrors from "http-errors";

@provide(VehicleService)
export class VehicleService {

    constructor(@unmanaged() private vehicleModel = VehicleModel) {}

    public async save(vehicle: Vehicle): Promise<VehicleDocument> {
        return await this.vehicleModel.create(vehicle);
    }

    public async findById(id: string, options?: QueryOptions): Promise<VehicleDocument> {
        return await this.vehicleModel.findById(id)
            .populate(options?.populate || "")
            .select(options?.select || "")
            .orFail()
            .exec();
    }

    public async findOne(query?: FilterQuery<VehicleDocument>, options?: QueryOptions): Promise<VehicleDocument> {
        return await this.vehicleModel.findOne(query || {})
            .populate(options?.populate || "")
            .select(options?.select || "")
            .orFail()
            .exec();
    }

    public async find(query?: FilterQuery<VehicleDocument>, options?: QueryOptions): Promise<VehicleDocument[]> {
        return await this.vehicleModel.find(query || {})
            .populate(options?.populate || "")
            .select(options?.select || "")
            .orFail()
            .exec();
    }

    public async paginate(query: FilterQuery<VehicleDocument>, options: PaginateOptions): Promise<PaginateResult<VehicleDocument>> {
        return this.vehicleModel.paginate(query, options);
    }

    public async updateById(id: string, updateBody: UpdateQuery<VehicleDocument>): Promise<VehicleDocument> {
        return this.vehicleModel.findByIdAndUpdate(id, updateBody, { new: true });
    }

    public async updateOne(query: FilterQuery<VehicleDocument>, updateBody: UpdateQuery<VehicleDocument>): Promise<VehicleDocument> {
        return this.vehicleModel.findByIdAndUpdate(query, updateBody, { new: true });
    }

    // public async updatePassword(user: UserDocument, passwordUpdate: UserPasswordUpdate): Promise<UserDocument> {
    //     if (!await comparePasswords(user.password, passwordUpdate.currentPassword)) {
    //         throw new httpErrors.Unauthorized("Wrong old password!");
    //     }

    //     return this.userModel.findByIdAndUpdate(user.id, { password: passwordUpdate.newPassword }, { new: true })
    //         .orFail()
    //         .exec();
    // }

    public async countDocuments(query?: FilterQuery<VehicleDocument>): Promise<number> {
        return !query || query === {} ?
            this.vehicleModel.estimatedDocumentCount().exec() : // Faster
            this.vehicleModel.countDocuments(query || {}).orFail().exec(); // Slower
    }

    public async deleteById(id: string): Promise<VehicleDocument> {
        return this.vehicleModel.findOneAndDelete({ _id: id })
            .orFail()
            .exec();
    }

}
