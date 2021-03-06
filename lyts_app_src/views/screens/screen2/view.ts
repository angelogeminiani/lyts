

export default function view(uid: string, props?: any): string {
    props = props || {};
    return `
            <div id="${uid}" class="">
                
                <nav>
                    <div class="nav-wrapper">
                      <a href="#" class="brand-logo">Logo</a>
                      <ul id="nav-mobile" class="right hide-on-med-and-down">
                        <li><a data-router="relative" href="screen2/page1">Page 1 (home)</a></li>
                        <li><a data-router="relative" href="screen2/page2/foo/boo">Page 2</a></li>
                        <li><a data-router="relative" href="screen2/call">Call a Function in Javascript</a></li>
                      </ul>
                    </div>
                </nav>
                
                <div id="${uid}_pages"></div>        
                        
            </div>

        `;
}