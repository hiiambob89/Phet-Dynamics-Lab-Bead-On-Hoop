export class simData {
    constructor(interval){
        this.data = [];
        this.interval = interval;
    }
    
    insert(time, theta, velocity){
        this.data.push(new dataPoint(time, theta, velocity));
    }

    getTheta(time){
        let dataIndex = (time/this.interval).toFixed(0);
        //console.log(dataIndex)
        
            if (dataIndex > this.data.length-1) {
            dataIndex = this.data.length-1;
            }
        
        return this.data[dataIndex].theta;
    }

    getVelocity(time){
        let dataIndex = (time/this.interval).toFixed(0);
        if (dataIndex > this.data.length-1) {
            dataIndex = this.data.length-1;
            }
        return this.data[dataIndex].velocity;
    }
// 
    
}

class dataPoint {
    constructor(time, theta, velocity){
        this.time = time;
        this.theta = theta;
        this.velocity = velocity;
    }
}
