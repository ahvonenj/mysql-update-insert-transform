function JModal(centered, x, y, width, height, html, backgroundcolor, shadowcolor)
{
    "use strict";
    
    this.centered = centered || false;
    this.x = x || 100;
    this.y = y || 100;
    this.width = width || 600;
    this.height = height || 300;
    this.originalhtml = html || '';
    this.backgroundcolor = backgroundcolor || '#ecf0f1';
    this.shadowcolor = shadowcolor || '#bdc3c7';
    this.padding = 5;
    
    this.modalid = 'jm-' + Math.round(Math.random() * 10000) + '-' + Math.round(Math.random() * 10000);
    
    
    /*******************************************************************************************************
    **STYLING
    *******************************************************************************************************/
    
    
    //MODAL POPUP STYLE
    this.styleelement = $('<style/>');
    
    this.styletext = '\t#' + this.modalid + '\n\t{\n';
    
    this.styletext += '\t\tposition: ' + 'absolute' + ';\n';
    
    if(this.centered)
    {
        let wx = $(window).width();
        let wy = $(window).height();
        
        this.styletext += '\t\tleft: ' + (wx / 2 - this.width / 2) + 'px;\n';
        this.styletext += '\t\ttop: ' + (wy / 2 - this.height / 2) + 'px;\n';
    }
    else
    {
        this.styletext += '\t\tleft: ' + this.x + 'px;\n';
        this.styletext += '\t\ttop: ' + this.y + 'px;\n';
    }
    
    this.styletext += '\t\twidth: ' + this.width + 'px;\n';
    this.styletext += '\t\theight: ' + this.height + 'px;\n';
    this.styletext += '\t\tpadding: ' + this.padding + 'px;\n';
    this.styletext += '\t\tbackground-color: ' + this.backgroundcolor + ';\n';
    
    this.styletext += '\t\t-webkit-box-shadow: ' + '5px 5px 1px 1px rgba(0, 0, 0, 0.40);' + ';\n';
    this.styletext += '\t\t-moz-box-shadow: ' + '5px 5px 1px 1px rgba(0, 0, 0, 0.40);' + ';\n';
    this.styletext += '\t\tbox-shadow: ' + '5px 5px 1px 1px rgba(0, 0, 0, 0.40);' + ';\n';
    
    this.styletext += '\t\tborder: ' + '1px solid #bdc3c7' + ';\n';
    
    this.styletext += '\t\tdisplay: ' + 'none' + ';\n';

    this.styletext += '\t}\n';
    
    
    //MODAL CLOSE BUTTON STYLE
    this.styletext += '\n\t.jmodal-close\n\t{\n';
    this.styletext += '\t\tposition: ' + 'absolute' + ';\n';
    this.styletext += '\t\tright: ' + '2' + 'px;\n';
    this.styletext += '\t\ttop: ' + '2' + 'px;\n';
    this.styletext += '\t\twidth: ' + '25' + 'px;\n';
    this.styletext += '\t\theight: ' + '25' + 'px;\n';
    this.styletext += '\t\tline-height: ' + '25' + 'px;\n';
    this.styletext += '\t\ttext-align: ' + 'center' + ';\n';
    
    this.styletext += '\t\tborder: ' + '1px solid #bdc3c7' + ';\n';
    
    this.styletext += '\t}\n';
    
    
    //MODAL CLOSE BUTTON HOVER STYLE
    this.styletext += '\n\t.jwmodal-close:hover\n\t{\n';
    this.styletext += '\t\tcursor: ' + 'pointer' + ';\n';
    this.styletext += '\t}\n';
    

    /*******************************************************************************************************
    **HTML
    *******************************************************************************************************/
    
    
    this.styleelement.text(this.styletext);
    $('head').append(this.styleelement);
    
    this.htmlelement = $('<div/>',
    {
        id: this.modalid,
        class: 'jmodal'
    });
    
    this.htmlelement.append(html);
    
    
    this.htmlelement.append('<div class = "jmodal-close" data-jmclose = "' + this.modalid + '">X</div>');
    
    $('body').append(this.htmlelement);
    
    
    return this;
}

JModal.prototype.show = function()
{
    this.htmlelement.fadeIn(100);
    return this;
}

JModal.prototype.toggle = function()
{
    this.htmlelement.fadeToggle(100);
    return this;
}