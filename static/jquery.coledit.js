(function($){

    var methods = {
        init : function(options) {
            var savedOptions = this.data('coledit');
            if (typeof(savedOptions) != 'undefined') { // already initialized
                this.data('coledit', $.extend(savedOptions, options));
                return;
            }
            
            var exOptions = $.extend({
                minItems: 0,
                maxItems: -1,
                defaultItems: 0,
                btnAutoHide: true,
                template: 'template'
            }, options);
                                    
            if ($('[role=template]', this).length !== 0){
                var template = $('[role=template]', this);           
                //prepareTemplate(template);
                exOptions.template = $('<div>').append(template.clone()).html();
                template.remove();
            }
            
            this.addClass('coledit').data('coledit', exOptions);
                        
            $('[role=addItem]', this).click(function() {
                addItem(getRoot($(this)));
            });
            $('[role=removeItem]', this).click(function() {
                removeItem($(this));
            });
            $('[role=item]',this).each(function(index, item) {
                prepareTemplate($(item));
            });
            updateItems($(this));
            if (typeof(exOptions.onAddItem) != 'undefined') {
                $('[role=item]',this).each( function(index, item) {
                    options.onAddItem(item, index);
                });
            }
            var countForAdd = exOptions.defaultItems - count(this);
            for (var i = 0; i < countForAdd; i++) {
                addItem(this);
            }
            updateItems(this);
            return this;
        },
        addItem : function() {
            return addItem(getRoot(this));
        },
        removeItem : function() {
            removeItem(this);
            return this;
        },
        count: function () {
            return count(getRoot(this));
        }
    };

    function addItem(root) {
        var options = root.data('coledit');
        if (options.maxItems > -1 && count(root) >= options.maxItems) {
            return undefined;
        }
        var items = $('[role=items]', root);
        if (items.length === 0) {
            items = root;
        }
        var template = $(options.template);
        prepareTemplate(template);
        var item = template
            .attr('role', 'item')
            .appendTo(items);
        
        $('[role=removeItem]', item).click(function() {
            methods.removeItem.apply( $(this) );
        });
        
        updateItems(root);
        
        if (typeof(options.onAddItem) != 'undefined') {
            options.onAddItem(item.get(), count(root) - 1);
        }
        
        return item;
    }

    function removeItem(item) {
        var root = getRoot(item);
        var options = root.data('coledit');
        if (count(root) <= options.minItems) {
            return;
        }
        $(item).parents('[role=item]').remove();
        updateItems(root);
        if (typeof(options.onRemoveItem) != 'undefined') {
            options.onRemoveItem(item.get(), count(root));
        }
    }

    function count(root) {
        return $('[role=item]', root).length;
    }

    function getRoot(element) {
        return element.parents('.coledit');
    }

    function updateItems(root) {
        var options = root.data('coledit');
        if (options.btnAutoHide) {
            if (options.maxItems > -1 && count(root) >= options.maxItems) {
                $('[role=addItem]', root).hide();
            } else {
                $('[role=addItem]', root).show();
            }
            if (count(root) <= options.minItems) {
                $('[role=removeItem]', root).hide();
            } else {
                $('[role=removeItem]', root).show();
            }
        }
        $('[role=item]', root).each(function (index, item){
            $('*', item).each(function(i1, element) {
                var templates = {};
                for (var i=0, attrs=element.attributes, l=attrs.length; i<l; i++){
                    var name = attrs.item(i).nodeName;
                    var value = attrs.item(i).nodeValue;
                    if (name.indexOf('data-template-') === 0) {
                        templates[name.substring(14)] = value;
                    }
                }
                for (var key in templates){
                    if(templates.hasOwnProperty(key)){
                        if (key == 'text') {
                            $(this).text(templates[key].replace('#', index));
                        } else {
                            $(this).attr(key, templates[key].replace('#', index));
                        }
                  }
                }
            });
        });
    }

    function prepareTemplate(element) {
        $('*', element).each(function(index, el) {
            var templateAttrs = {};
            var i = el.attributes.length;
            while( i-- ) {
                var attr = el.attributes[i];
                var attrName = attr.nodeName.toLowerCase();
                var attrValue = attr.nodeValue;
                if (attrValue.indexOf('#') > -1) {
                    templateAttrs['data-template-' + attrName] = attrValue;
                    el.removeAttributeNode(attr);
                }
            }
            $(el).attr(templateAttrs);
        });
        return element;
    }
    function outerHtml(s){
        return (s)
        ? this.before(s).remove()
        : jQuery("&lt;p&gt;").append(this.eq(0).clone()).html();
    }


    $.fn.coledit = function (method) {
        if ( methods[method] ) {
          return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          $.error( 'Method with name ' +  method + ' not found.' );
        }
    };    
})(jQuery);