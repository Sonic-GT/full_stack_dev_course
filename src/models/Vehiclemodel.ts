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
    user_id?: string 
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
    user_id: optional(string()),
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
    user_id: {
        type: String,
    },
    plate: {
        type: String,
        required: [true, "Plate is required"],
        unique: true,
    },
    manufacturer: {
        type: String,
        required: [true, "Manufacturer is required"],
    },
    cc: {
        type: Number,
        required: [true, "CC is required"],
    },
    carModel: {
        type: String,
        required: [true, "CarModel is required"],
    },
    seats: {
        type: Number,
        required: [true, "Seats is required"],
    },
    fuel: {
        type: [String],
        enum: [FuelType.DISEL, FuelType.PETROL, FuelType.GPL],
        required: [true, "Fuel is required"],
    },
    km: {
        type: Number,
        default: 0,
    },
    matriculationDate: {
        type: String,
        required: [true, "MatriculationDate is required"],
    },
    color: {
        type: String,
        required: [true, "Color is required"],
    },
    hasABS: {
        type: Boolean,
        required: [true, "HasABS is required"],
    },
    notes: {
        type: String,
        required: [true, "Notes are required"],
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
