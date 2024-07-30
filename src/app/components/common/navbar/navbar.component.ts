import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ReclutameService } from 'src/services/reclutame.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  arrPais: any = [];
  arrCiudades: any = [];
  frmCandidato: FormGroup | any;
  frmCompany: FormGroup | any;
  submittedCandidato = false;
  submittedCompany = false;
  checkTerminosCandidato = false;
  checkTerminosCcompany = false;

  // Navbar Sticky
  isSticky: boolean = false;
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= 50) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  constructor(
    public router: Router,
    private api: ReclutameService,
    private formBuilder: FormBuilder,
  ) {
    this.getPaises();
  }

  ngOnInit(): void {
    this.frmCandidato = this.formBuilder.group({
      nombreCandidato: ["", Validators.required],
      apellidoCandidato: ["", Validators.required],
      emailCandidato: ["", Validators.required],
      telefonoCandidato: ["", Validators.required],
      passwordCandidato: ["", Validators.required],
    });

    this.frmCompany = this.formBuilder.group({
      nombreAdmin: ["", Validators.required],
      apellidoAdmin: ["", Validators.required],
      emailAdmin: ["", Validators.required],
      telefonoAdmin: ["", Validators.required],
      passwordAdmin: ["", Validators.required],
      nombreCompany: ["", Validators.required],
      paisCompany: ["", Validators.required],
      ciudadCompany: ["", Validators.required],
    });
  }

  get f() {
    return this.frmCandidato.controls;
  }

  get fCo() {
    return this.frmCompany.controls;
  }

  classApplied = false;
  toggleClass() {
    this.classApplied = !this.classApplied;
  }

  // Tabs 1
  currentTab = 'tab1';
  switchTab(event: MouseEvent, tab: string) {
    event.preventDefault();
    this.currentTab = tab;
  }

  // Tabs 2
  currentInnerTab = 'innerTab1';
  switchInnerTab(event: MouseEvent, tab: string) {
    event.preventDefault();
    this.currentInnerTab = tab;
  }

  // Modal Popup
  isOpen = false;
  openPopup(): void {
    this.isOpen = true;
  }
  closePopup(): void {
    this.isOpen = false;
  }

  async getPaises() {
    const pais = await this.api.getPais();
    this.arrPais = pais.items;
  }

  async getCiudades(id: number) {
    const ciudad = await this.api.getCiudades(id);
    this.arrCiudades = ciudad.items;
  }

  async registroCandidato() {
    console.log(this.frmCandidato.value);
    console.log(this.frmCandidato.value.nombreCandidato);

    console.log(this.f);

    this.submittedCandidato = true;
    if (this.frmCandidato.invalid) {
      return;
    }
    try {
      const reg = await this.api.registroUsuario(this.f.emailCandidato.value, this.f.passwordCandidato.value, 3, "1234567890", 0);
      console.log(reg);
      const regCandidato = await this.api.registroCandidato(this.f.nombreCandidato.value, this.f.apellidoCandidato.value, this.f.emailCandidato.value, this.f.telefonoCandidato.value, reg.var_id_usuario);
      console.log(regCandidato);

      // Redirect to dashboard candidate
      this.router.navigate(['/candidates-dashboard']);
    } catch (error: any) {
      console.log('Error Status: ', error.status);
    }
  }

  checkTyCCandidato(event: any) {
    this.checkTerminosCandidato = event.currentTarget.checked;
  }

  checkTyCCompany(event: any) {
    this.checkTerminosCcompany = event.currentTarget.checked;
  }

  async registroCompany() {

    console.log(this.frmCompany.value);

    this.submittedCompany = true;
    if (this.frmCompany.invalid) {
      return;
    }

    try {
      const regC = await this.api.registroEmpresa(this.frmCompany.value.nombreCompany, this.frmCompany.value.paisCompany, this.frmCompany.value.ciudadCompany, this.frmCompany.value.telefonoAdmin);
      console.log(regC);
      const reg = await this.api.registroUsuario(this.frmCompany.value.emailAdmin, this.frmCompany.value.passwordAdmin, 1, "1234567890", regC.var_id_empresa);
      console.log(reg);
      const regCandidato = await this.api.registroReclutador(this.frmCompany.value.nombreAdmin, this.frmCompany.value.apellidoAdmin, this.frmCompany.value.emailAdmin, reg.var_id_usuario, regC.var_id_empresa, this.frmCompany.value.telefonoAdmin);
      console.log(regCandidato);

      // Redirect to dashboard
      this.router.navigate(['/dashboard']);

    } catch (error: any) {
      console.log('Error Status: ', error.status);
    }
  }

}
