import { Component, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Achievement } from '../interfaces/achievement';

@Component({
  selector: 'app-achievement',
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.css']
})
export class AchievementComponent {
  achievementsCompleted=signal<Achievement[]>([]);
  achievementsIncompleted=signal<Achievement[]>([]);

  constructor(apiSvc: ApiService){
    apiSvc.getAchievements().subscribe((resp)=>{
      const sortedCompleted = [...resp.completed].sort((a, b) => {
        const dateA = a.pivot?.date ? new Date(a.pivot.date).getTime() : 0;
        const dateB = b.pivot?.date ? new Date(b.pivot.date).getTime() : 0;
        return dateB - dateA; // más recientes primero
      });
      this.achievementsCompleted.set(sortedCompleted);
      this.achievementsIncompleted.set(resp.uncompleted);
    });
  }

  //para dale la vuelta a las tarjetas
  flippedIndex: number | null = null;

  toggleFlip(index: number) {
    this.flippedIndex = this.flippedIndex === index ? null : index;
  }
}


// ([
//     {title: "Plusmarquista",
//       date: "3/2/2017",
//       habit: "Corredor mañanero",
//       level: "3"
//     },
//     {title: "Cocinillas",
//       date: "5/10/2019",
//       habit: "Cocina para estudiantes",
//       level: "1"
//     },
//     {title: "Medallista olimpico",
//       date: "10/8/2017",
//       habit: "Corredor mañanero",
//       level: "8"
//     },
//     {title: "Rata de biblioteca",
//       date: "20/3/2018",
//       habit: "Lector de clasicos",
//       level: "5"
//     },
//     {title: "Plusmarquista",
//       date: "3/2/2017",
//       habit: "Corredor mañanero",
//       level: "3"
//     },
//     {title: "El terror de los descuentos",
//       date: "3/2/2017",
//       habit: "Corredor mañanero",
//       level: "3"
//     },
//   ]);