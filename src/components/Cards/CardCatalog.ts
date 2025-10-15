import { Card } from './Card';
import { IEvents } from '../base/Events';


export class CardCatalog extends Card {
inCart: boolean = false;

constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        container.addEventListener('click', () => {
            this.events.emit('card:select', { id: container.dataset.id });
        });
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
}
