/**
 * Базовый компонент
 */
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
        // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
    }

    // Инструментарий для работы с DOM в дочерних компонентах
    get element(): HTMLElement {
        return this.container;
    }
    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Установить/снять disabled
    protected setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }

    // Переключить CSS-класс
    protected toggleClass(element: HTMLElement, className: string, force?: boolean) {
        if (element) {
            element.classList.toggle(className, force);
        }
    }


    // Установить изображение с альтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }
    

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
