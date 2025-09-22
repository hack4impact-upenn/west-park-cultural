/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { ICommunication } from '../models/communication.model';
declare const createCommunication: (communication: ICommunication) => Promise<ICommunication & {
    _id: import("mongoose").Types.ObjectId;
}>;
declare const getCommunicationById: (id: string) => Promise<(ICommunication & {
    _id: import("mongoose").Types.ObjectId;
}) | null>;
declare const getAllCommunications: () => Promise<(ICommunication & {
    _id: import("mongoose").Types.ObjectId;
})[]>;
export { createCommunication, getCommunicationById, getAllCommunications };
//# sourceMappingURL=communication.service.d.ts.map