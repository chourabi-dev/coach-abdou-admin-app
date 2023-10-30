import { Exercice } from './Exercice';

export interface WorkoutPlan {
    duration:number;
    title:string;
    description:string;
    startDate:Date;
    exercices:  Exercice[]

    
}