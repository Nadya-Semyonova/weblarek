import { Component } from '../base/Component';
import { categoryMap } from '../../utils/constants';


export abstract class Card extends Component<{}> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;

    constructor(protected container: HTMLElement) {
        super(container);
        
        this._title = this.container.querySelector('.card__title') as HTMLElement;
        this._image = this.container.querySelector('.card__image') as HTMLImageElement;
        this._category = this.container.querySelector('.card__category') as HTMLElement;
        this._price = this.container.querySelector('.card__price') as HTMLElement;
        
    }
    
    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this._title?.textContent || '');
    }
    
    set category(value: string) {
        this.setText(this._category, value);
        const cssClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this._category.className = `card__category ${cssClass}`;
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }
}