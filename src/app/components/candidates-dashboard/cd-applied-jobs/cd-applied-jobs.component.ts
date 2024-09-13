import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/services/auth.service';
import { ReclutameService } from 'src/services/reclutame.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cd-applied-jobs',
  templateUrl: './cd-applied-jobs.component.html',
  styleUrls: ['./cd-applied-jobs.component.scss']
})
export class CdAppliedJobsComponent {
  arrVacantes: any = [];
  displayedText: any = [];
  empresa: any = [];

  constructor(
    private api: ReclutameService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private auth: AuthService,
    private ref: ChangeDetectorRef
  ) {
    this.geVacantes(this.auth.currentUserValue.p_id_candidato);
  }

    // Modal Popup
    isOpen = false;
    openPopup(): void {
      this.isOpen = true;
      this.ref.detectChanges();
    }
    closePopup(): void {
      this.isOpen = false;
    }

  async geVacantes(idCandidado: any) {
    this.spinner.show();
    try {
      const vacantes = await this.api.getVacantesAplicados(idCandidado);
      console.log(vacantes);
      this.arrVacantes = vacantes.p_result;


      const emp = await this.api.getEmpresa(vacantes.p_result[0].id_empresa);
      this.empresa = emp.items[0];
      console.log('empresa',this.empresa);

    } catch (err) {
      console.error;
    }
    this.spinner.hide();
  }

  openModal (item: any) {
    this.displayedText = {
      'vacancy_name': item.titulo_vacante,
      'Job Type': item.nombre_tipo_trabajo,
      'technical_requirements': item.descripcion_vacante,
      'Career level': item.nombre_nivel_profesional,
      'Industry': item.nombre_industria,
      'Qualification': item.nombre_grado_escolar,
      'Experience': item.nombre_experiencia,
      'City': item.nombre_ciudad,
      'Country': item.nombre_pais,
      'Specialisms': item.nombre_categoria,
      'Gender': item.nombre_genero,
      'Offered salary (monthly)': item.rango,
      'Application deadline date': item.fecha_limite_solicitud,

    }
    this.openPopup(); 
    this.ref.detectChanges();
  }
}
