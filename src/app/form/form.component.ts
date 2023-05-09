import { Component, OnInit, inject,  } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Friend } from '../model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

    friendsForm!: FormGroup
    nameField= 'name'
    factsArray!: FormArray
    friend!: Friend

    // @Autowired field injection method
    fb: FormBuilder = inject(FormBuilder)

    ngOnInit(): void {
        this.friendsForm = this.createForm()
        // or sessionStorage
        const data = localStorage.getItem('friend')
        if (!!data) {
            this.friend = JSON.parse(data)
            console.info('friend data from localstorage', this.friend)
        }
    }

    // @Autowired (constructor injection method, can use either public, private or protected)
    // constructor(private fb: FormBuilder) {
    // }

    // traditional way of creating formgroup and adding formcontrols
    private createForm(): FormGroup {
        this.factsArray = this.fb.array([])
        return new FormGroup({
            [this.nameField]: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
            email: new FormControl<string>('', [Validators.required, Validators.email]),
            age: new FormControl<number>(10, [Validators.min(10)]),
            gender: new FormControl(''),
            facts: this.factsArray
        })
    }

    private createFormWithFormBuilder(): FormGroup {
        return this.fb.group({
            [this.nameField]: this.fb.control<string>(''),
            email: this.fb.control<string>(''),
            age: this.fb.control<number>(10),
            gender: this.fb.control<string>(''),
        })
    }

    processForm() {
        const data = this.friendsForm.value
        console.info("processing form", data)
        const friend: Friend = this.friendsForm.value
        // localStorage can only store string object, so must stringify data
        localStorage.setItem('friend', JSON.stringify(friend))
        // this.friendsForm = this.createForm() (reset clears all initial values)
        this.friendsForm.reset()
    }

    invalidField(ctrlName: string): boolean {
        return !!(this.friendsForm.get(ctrlName)?.invalid && this.friendsForm.get(ctrlName)?.dirty)
    }

    addAFact() {
        this.factsArray.push(this.createFriendsFact())
    }

    removeAFact(i: number) {
        this.factsArray.removeAt(i)
    }

    private createFriendsFact(): FormGroup {
        return this.fb.group({
            fact: new FormControl<string>('', [Validators.required]),
            value: this.fb.control('', [ Validators.minLength(3)])
        })
    }

    validForm() {
        return this.friendsForm.valid && this.factsArray.length > 0
    }

}
