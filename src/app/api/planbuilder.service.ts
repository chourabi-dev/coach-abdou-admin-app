import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanbuilderService {

  plan = {
    title : "weight gains",
    description: "this is a weight gain program for proffisionals",
    durarion: 20, // semaies


    exercice : [
      {
        name :"",
        description:"",
        day: 1, // days from 1 to 7
        machine:{},
        reps: [ { reps:15, hold:30 },{ reps:12, hold:30 },{ reps:12, hold:30 }, ]
      }
    ]

  }


  constructor() { }
}
