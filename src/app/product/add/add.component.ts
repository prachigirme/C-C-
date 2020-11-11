import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Lookup } from '../models/lookup';
import { Product } from '../models/product';
import { LookupService } from '../services/lookup.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  productForm=this.fb.group({});
  units:Observable<Lookup[]>;
  categories:Observable<Lookup[]>;
  formSubmitted = false;

  
  constructor(private fb:FormBuilder,
    private lookupservice:LookupService,
    private productservice:ProductService,
    private router:Router,
    private route:ActivatedRoute
    ) { }

  ngOnInit(): void {


    this.productForm.addControl('id',new FormControl(''));
    this.productForm.addControl('name',new FormControl('',[Validators.required]));
    this.productForm.addControl('code',new FormControl('',[Validators.required]));
    this.productForm.addControl('unit',new FormControl('',[Validators.required]));
    this.productForm.addControl('category',new FormControl('',[Validators.required]));
    this.productForm.addControl('salesRate',new FormControl('',[Validators.required]));
    this.productForm.addControl('purchaseRate',new FormControl('',[Validators.required]));

    this.units = this.lookupservice.getUnits();
    this.categories = this.lookupservice.getProductCategories();

    const product$ = this.route.paramMap.pipe(      //to edit form
      switchMap((params: ParamMap) =>
          this.productservice.getProductById(Number.parseInt(params.get('id')))
        ));

        product$.subscribe(product=>{
          if(!isNullOrUndefined(product)){
            console.log(product);
            this.productForm.get('id').setValue(product.id);
            this.productForm.get('name').setValue(product.name);
            this.productForm.get('code').setValue(product.code);
            this.productForm.get('category').setValue(product.category.code);
            this.productForm.get('unit').setValue(product.unit.code);
            this.productForm.get('salesRate').setValue(product.salesRate);
            this.productForm.get('purchaseRate').setValue(product.purchaseRate);
          }
        })

  }


  save($event):void
  {
       this.formSubmitted = true;
        if(!this.productForm.valid)
        {
           return;
        }
        this.saveProduct();
        this.router.navigate(['/products']);
  }

  saveAndContinue($event):void
  {
    this.formSubmitted = true;
    if(!this.productForm.valid)
        {
           return;
        }
        this.saveProduct();
      

  }

  private saveProduct()
  {
    const product=new Product();

    product.id=this.productForm.get('id').value;
    product.name=this.productForm.get('name').value;
    product.code=this.productForm.get('code').value;

    product.category = this.getLookupObjFromCode(this.productForm.get('category').value);
    product.unit =  this.getLookupObjFromCode(this.productForm.get('unit').value);
    product.purchaseRate =  this.productForm.get('purchaseRate').value;
    product.salesRate = this.productForm.get('salesRate').value;

    
    if(product.id == 0){
      this.productservice.addNewProduct(product);}
      else {
        this.productservice.updateProduct(product);
      }
      
  }


  getLookupObjFromCode(code:string):Lookup{
    var lookup:Lookup = null;
    const subscription = this.units.subscribe(lookups => {
      lookup  = lookups.find(item => item.code == code)
    })
    subscription.unsubscribe();
    return lookup;
  }

  


}
