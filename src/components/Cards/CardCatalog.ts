import { Card } from './Card';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';



export class CardCatalog extends Card {
inCart: boolean = false;
_image: HTMLImageElement;
_category: HTMLElement;


constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._image = this.container.querySelector('.card__image') as HTMLImageElement;
        this._category = this.container.querySelector('.card__category') as HTMLElement;
        container.addEventListener('click', () => {
            this.events.emit('card:select', { id: container.dataset.id });
        });
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
    set image(value: string) {
            this.setImage(this._image, value, this._title?.textContent || '');
        }
        
        set category(value: string) {
            this.setText(this._category, value);
            const cssClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
            this._category.className = `card__category ${cssClass}`;
        }
}
