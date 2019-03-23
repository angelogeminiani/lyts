import ly from "../../../../lyts/lyts_core/ly";
import Component from "../../../../lyts/lyts_core/view/components/Component";
import ElementWrapper from "../../../../lyts/lyts_core/view/components/ElementWrapper";
import view from "./view";


class CompLoading
    extends Component {

    // ------------------------------------------------------------------------
    //                      c o n s t
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    //                      f i e l d s
    // ------------------------------------------------------------------------

    private readonly _btn: ElementWrapper;

    // ------------------------------------------------------------------------
    //                      c o n s t r u c t o r
    // ------------------------------------------------------------------------

    constructor(element?: HTMLElement) {
        super(element);

        this._btn = super.getFirst("#" + this.uid + "_btn");
    }

    // ------------------------------------------------------------------------
    //                      o v e r r i d e
    // ------------------------------------------------------------------------

    protected render(): string {
        return view(this.uid, {});
    }

    protected free(): void {

    }

    protected ready(): void {
        this.init();
    }

    public localize(): void {

        super.localize();
    }

    // ------------------------------------------------------------------------
    //                      p r o p e r t i e s
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    //                      p u b l i c
    // ------------------------------------------------------------------------


    // ------------------------------------------------------------------------
    //                      p r i v a t e
    // ------------------------------------------------------------------------

    private init(): void {
        try {


        } catch (err) {
            ly.console.error("CompLoading.init", err);
        }
    }


}

// ------------------------------------------------------------------------
//                      e x p o r t s
// ------------------------------------------------------------------------

export default CompLoading;