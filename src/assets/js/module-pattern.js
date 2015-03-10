
// so first, we want to create a completely new scope 
// to work in, stops us polluting global namespace.
// we'll use a self-invoking function

// include semicolon to prevent issues if concatenating files

;(function($) {
  
    /////////////////////////////////////////////////////////////
    //// a contrived widget with a litle functionality
    /////////////////////////////////////////////////////////////

    // only constructors should begin with a capital letter!

    // plus constructors are awesome because all dependencies
    // get passed in, meaning we very easily unit test if need be :)

    function DateTimeWidget(elem) {
        this.$elem     = $(elem);
        this.$timeElem = this.$elem.find('[data-time="time"]');
        this.$dateElem = this.$elem.find('[data-time="date"]');

        this.timeTimer = null;
        this.dateTimer = null;

        this.hookupTime();
        this.hookupDate();
    };

    // use a prototype because that way every instance of a DateTimeWidget
    // can be extended at once, by anyone, to add new functionality
  
    DateTimeWidget.prototype = {
        
        constructor : DateTimeWidget,
        
        // note use of $.proxy below!

        // this ensures that the callback is always executed
        // in the context of the object you specify - in this
        // case the widget itself.
        // all functions/fields are available without the need
        // for another variable, 's', or whatever :)

        hookupDate : function() {
            this.updateDate();
            this.dateTimer = setInterval($.proxy(this.updateDate, this), 60000);
        },
        
        hookupTime : function() {
            this.updateTime();
            this.timeTimer = setInterval($.proxy(this.updateTime, this), 100);
        },

        updateTime : function() {
            this.$timeElem.text(new Date().toLocaleTimeString());
        },
        
        updateDate : function() {
            this.$dateElem.text(new Date().toDateString());
        },
        
        hideDate : function() {
            this.$dateElem.slideUp(100);
            clearInterval(this.dateTimer);
        },
        
        showDate : function() {
            this.$dateElem.slideDown(100);
            this.hookupDate();
        }
    };

    // also, latch onto something to expose to the wider world
    window.DateTimeWidget = DateTimeWidget;


    // while we're here, why not make it into 
    // a jQuery plugin?! why the hell not :)    
    // e.g. $(".my-widget").dateTimeWidget()
  
    $.fn.dateTimeWidget = function(option) {

        return this.each(function() {
          
            var $this = $(this),
                data  = $this.data("dateTimeWidget");
            
            // check if we'd already worked on this element
            // if not, new up a widget and store against the element
          
            if (!data) $this.data("dateTimeWidget", (data = new DateTimeWidget(this)));

            // if a string was passed a string
            // the intention is to call a method on the widget
            // e.g. $(".widget").dateTimeWidget("hideDate");
          
            if (typeof option === "string") data[option]();
        });
    };

    // we can go one step further again by hooking in a data API!
    // everything can then be set up purely declaratively from HTML
    // e.g. <div data-widget="dateTime"></div>
    // choose whatever naming convention you like
  
    $("[data-widget=dateTime]").each(function() {
        $(this).dateTimeWidget();
    });

  
}(jQuery)); 


// this is our initialisation script
// where everything on the page gets hooked up

;(function($) {
  
    
  var objectWidget  = new DateTimeWidget(document.getElementById("object-widget")),
      $pluginWidget = $(".plugin").dateTimeWidget();
        

    // we can then interact with the widget differently
    // depending whether working with jQuery plugin or directly with object object
  
    $pluginWidget.dateTimeWidget("hideDate");
  
    // so let's do something with our
    // object widget as well, just for proof :)
  
    // set up a click handler to toggle date
    // note $.proxy again to save writing out an anonymous function
  
    // NOTE: toggle() as used here has been removed from
    // jQuery 1.9+
  
  objectWidget.$elem.find(".toggle-date").toggle(
    $.proxy(objectWidget.hideDate, objectWidget),
    $.proxy(objectWidget.showDate, objectWidget)
  );

}(jQuery));
