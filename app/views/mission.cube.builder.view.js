define([
    'jquery', 
    'underscore', 
    'template!mission.cube.builder',
    'template!mission.cube.stats',
    'foundation-offcanvas'
], function($, _, TPL_mission_builder, TPL_mission_stats) {

    var XplorationApp = Backbone.View.extend({
        className: 'mission-cube-builder view',
        id: 'mission-builder',
        events: {
            'change #ul-selector': 'onChangeSelector',
            'click #launch-button': 'onClickLaunch'
        },
        initialize: function() {
            var self = this;
            return Backbone.View.prototype.initialize.apply(self, arguments);
        },
        render: function(parameters) {
            var self = this;

            self.markup = TPL_mission_builder({
                model: this.model,
                name: this.model.get('user-fullname'),
                mission: this.model.get('mission'),
                components: this.model.get('components')
            });
            self.$el.html(self.markup);
            Backbone.View.prototype.render.apply(self, arguments);
            self.$el.find('.component').draggable({
                revert: true,
                containment: "window",
                // helper: "clone"
                start: function(event, ui) {
                    $(ui.helper).addClass('is-dragging');
                },
                stop: function(event, ui) {
                    $(ui.helper).removeClass('is-dragging');
                }
            });
            self.$el.find('.droppable-el').droppable({
                accept: '.component',
                hoverClass: 'is-dropping',
                drop: function( event, ui ) {
                    var $draggable = $(ui.draggable[0]);
                    var cat = $draggable.attr('data-component-cat');
                    var ind = $draggable.attr('data-component-index');
                    var com = self.model.get('components')[cat][ind];
                    self.model.addComponent(com);
                    self.model.calculateStats(function(err, stats) {
                        self.$el.find('.recap').html(TPL_mission_stats(stats));
                    });
                    $draggable.detach().appendTo(this);
                }
            });
            return self;
        },
        onChangeSelector: function(ev) {
            var value = $(ev.currentTarget).val();
            this.$el.find('.component-list').hide();
            this.$el.find(value).show();
        },
        onClickLaunch: function(ev) {
            window.app.show('missionDeploy');
        }
    });

    return XplorationApp;
});
