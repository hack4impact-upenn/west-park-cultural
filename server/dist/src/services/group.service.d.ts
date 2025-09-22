import { IGroup } from '../models/group.model';
declare const getAllGroups: () => Promise<(IGroup & Required<{
    _id: string;
}>)[]>;
declare const createCommunicationGroup: (group: IGroup) => Promise<IGroup & Required<{
    _id: string;
}>>;
declare const getCommunicationGroupById: (id: string) => Promise<(IGroup & Required<{
    _id: string;
}>) | null>;
declare const editGroupById: (_id: string, newGroupInfo: IGroup) => Promise<import("mongodb").UpdateResult>;
export { createCommunicationGroup, getCommunicationGroupById, getAllGroups, editGroupById, };
//# sourceMappingURL=group.service.d.ts.map