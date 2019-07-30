import * as THREE from 'three';
import {Mesh} from "three";

var FlyLine = function (flyLine,road,roadmesh) {
    Mesh.call(this,flyLine.geometry,flyLine.materials)
    this.name = "flyLine";
    this.road = road;
    // 车的最大速度
    this.maxSpeed = .25;
    // 飞线的最小速度
    this.minSpeed = 0;
    // 飞线速默认为最大速度
    this.speed = this.maxSpeed;
    // 是否卡住
    this.stuck = false;
    // 重启计时
    this.restartTimer = null;
    // 网格数据
    this.mesh = flyLine;
    // 雷达半径
    this.radarRadius = 20;
    this.roadmesh = roadmesh;
    this.index = Math.floor((Math.random()*100)+1);


    // // 设置位置,位置为随机车道上的位置
    // this.position.copy(randomLane.position);
    // var point = new THREE.Vector3(3.4, 0, 0);
    // flyLine.rotation.copy(randomLane.rotation);
    // // 设置点信息的轴角度，y为车的角度
    // point.applyAxisAngle(normal, flyLine.rotation.y);
    // // 如果随机数大于0.5 则直接在位置中添加点
    // if (types.random() > .5) {
    //     this.position.add(point);
    // } else {
    //     flyLine.rotation.y += Math.PI;
    //     this.position.sub(point);
    // }
    // 获取车的方向
    // this.direction = flyLine.getWorldDirection().negate();
    // this.direction.set(Math.round(this.direction.x), Math.round(this.direction.y), Math.round(this.direction.z));
    // this._initCollisionPoints();
}

FlyLine.inherit(Mesh, {
    /**
     *  更新
     */
    update : function() {
         var directionTmp = new THREE.Vector3;
        return function() {
            // 给移动方向上加速度，将该向量与所传入的标量s进行相乘。
            //directionTmp.copy(this.direction).multiplyScalar(this.speed);
            // 位置加上移动方向
            //this.mesh.position.add(this.mesh.position);

            let vector3 = directionTmp.fromBufferAttribute(this.road,this.index++);
            let vector = this.roadmesh.worldToLocal(vector3);
            this.position.x = vector.x;
            this.position.y = vector.y;
            // for (var i = 0 ; i<5;i++){
            //     let vector3 = directionTmp.fromBufferAttribute(this.road,i);
            // }
            // let array = this.geometry.attributes.position.array;
            // console.log("position",this.position);
            // console.log("geo.position",this.geometry.attributes.position);


            this.position
        };
    }(),
});

export default FlyLine;
