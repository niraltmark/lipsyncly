module.exports = function(app) {

    Array.prototype.minus = function(inner, outerSelector, innerSelector) {
        
        return this.filter(x => !inner.some(y => innerSelector(y) == outerSelector(x)));  

    }   

}