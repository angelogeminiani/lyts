import Page from "../../../../lyts_core/view/components/page/Page";
import ElementWrapper from "../../../../lyts_core/view/components/ElementWrapper";
import console from "../../../../lyts_core/commons/console";
import view from "./view";
import {Route} from "../../../../lyts_core/view/routing/Router";
import {Animate, AnimateEffect} from "../../../../lyts_core_style/styles/animate/Animate";


export default class Page1
    extends Page {


    // ------------------------------------------------------------------------
    //                      f i e l d s
    // ------------------------------------------------------------------------

    private readonly _content: ElementWrapper;


    // ------------------------------------------------------------------------
    //                      c o n s t r u c t o r
    // ------------------------------------------------------------------------

    constructor(route: Route) {
        super(route);

        this._content = super.getFirst("#" + this.uid + "_content");
    }

    // ------------------------------------------------------------------------
    //                      o v e r r i d e
    // ------------------------------------------------------------------------

    protected render(): string {
        return view(this.uid, {});
    }

    protected free(): void {

        // release memory

        console.log("REMOVED:", this.uid);
    }

    protected ready(): void {
        this.init();
    }

    public show(): void {
        super.show();
        Animate.apply(AnimateEffect.bouce, this.element, () => {
            console.log('Page1.show', AnimateEffect.bouce + ' animation terminated');
        });
    }

    public hide(): void {
        super.hide();
    }

    // ------------------------------------------------------------------------
    //                      p u b l i c
    // ------------------------------------------------------------------------


    // ------------------------------------------------------------------------
    //                      p r i v a t e
    // ------------------------------------------------------------------------

    private init(): void {
        try {


        } catch (err) {
            console.error("Page1.init()", err)
        }
    }


}