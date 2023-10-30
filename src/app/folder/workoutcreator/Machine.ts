import { Muscle } from './Muscle';

export interface Machine{
    title:string;
    description:string;
    imageURL:string;
    associatedMuscle:Muscle
}