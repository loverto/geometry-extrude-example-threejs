import * as THREE  from 'three';
import FlyLine from './FlyLine';

/**
 * 获得邻近汽车更新
 * @param flyLinesObjects 车数据
 */
var FlyLines = function(flyLinesObjects,mesh) {
    // 车
    this.flyLinesObjects = flyLinesObjects;
    this.road = mesh;
    // 可以移动的对象，比如车和云
    this.mobs = [];
    this._generate();
};
FlyLines.inherit(Object, {
     /**
     * 更新
     * @param data 延时参数等等
     */
    update : function(data) {
        // 遍历可移动内容
        this.mobs.forEach(function(object) {
            object.update(data);
            // object.mesh.geometry.attributes.position.needsUpdate = true;
            // object.mesh.geometry.attributes.normal.needsUpdate = true;
            // object.mesh.geometry.needsUpdate = true;
        });
    },
    /**
     * 生成
     * @private
     */
    _generate : function() {
        this.flyLinesObjects.forEach(function (flyLine) {
            var fly = new FlyLine(flyLine,this.road);
            this.mobs.push(fly)
        },this)
    }
});

export default FlyLines;

