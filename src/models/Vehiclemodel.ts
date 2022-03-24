import { model, Schema, Document, PaginateModel } from "mongoose";
//import { encryptPasswordSync } from "@utils/crypto";
import { anyJson, array, boolean, constant, Decoder, number, object, oneOf, optional, string } from "@mojotech/json-type-validation";
import uniqueValidator from "mongoose-unique-validator";
import paginate from "mongoose-paginate";

export enum FuelType {
    DISEL = "DISEL",
    PETROL = "PETROL",
    GPL = "GPL"
}

export interface Vehicle {
    plate: string
    manufacturer: string
    cc: number
    carModel: string
    seats: number
    fuel: string
    km?: number
    matriculationDate: String
    color: string
    hasABS: boolean
    notes: string
    isUsed?: boolean
    isVisible?: boolean
}
export interface VehicleDocument extends Vehicle, Document {
}
export const vehicleDecoder: Decoder<Vehicle> = object({
    plate: string(),
    manufacturer: string(),
    cc: number(),
    carModel: string(),
    seats: number(),
    fuel: oneOf(
        constant(FuelType.DISEL),
        constant(FuelType.PETROL),
        constant(FuelType.GPL)
    ),
    km: optional(number()),
    matriculationDate: string(),
    color: string(),
    hasABS: boolean(),
    notes: string(),
    isUsed: optional(boolean()),
    isVisible: optional(boolean()),
});

export const VehicleSchema = new Schema<Vehicle>({
    plate: {
        type: String,
        required: [true, "It's required"],
        unique: true,
    },
    manufacturer: {
        type: String,
        required: [true, "It's required"],
    },
    cc: {
        type: Number,
        required: [true, "It's required"],
    },
    carModel: {
        type: String,
        required: [true, "It's required"],
    },
    seats: {
        type: Number,
        required: [true, "It's required"],
    },
    fuel: {
        type: [String],
        enum: [FuelType.DISEL, FuelType.PETROL, FuelType.GPL],
        required: [true, "It's required"],
    },
    km: {
        type: Number,
        default: 0,
    },
    matriculationDate: {
        type: String,
        required: [true, "It's required"],
    },
    color: {
        type: String,
        required: [true, "It's required"],
    },
    hasABS: {
        type: Boolean,
        required: [true, "It's required"],
    },
    notes: {
        type: String,
        required: [true, "It's required"],
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    isVisible: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    }
});

VehicleSchema.plugin(uniqueValidator);
VehicleSchema.plugin(paginate);

export const VehicleModel = model<VehicleDocument>("Vehicle", VehicleSchema) as PaginateModel<VehicleDocument>;
