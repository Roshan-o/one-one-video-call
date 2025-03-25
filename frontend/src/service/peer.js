class PeerService{
    constructor(){
        if(!this.peer){ //if peer is not there we create a peer
            this.peer=new RTCPeerConnection({
                iceServers:[
                    //iceServer :first connect along a server then after knowing the public ip adress 
                    //establishes a direct connection
                    {
                        urls:[
                            "stun:stun.l.google.com:19302", //STUN
                            //used to establish a direct connection
                        ]
                    }
                ]
            })
        }
    }

    async getAnswer(offer){
        if(this.peer){
            console.log("offer:",offer);
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer)); //this tells WEBRTC what type of offer came like video tream,codecs details
            //accepts offer and generate a matching response
            const ans= await this.peer.createAnswer();//createAnswer contain-ip adress,connection parameters-what kind of media accepted,codec-supported audio video encoding format
            // console.log("ans at getAswer:",ans);
            await this.peer.setLocalDescription(new RTCSessionDescription(ans));
            //Locks in its chosen media settings
            //here remote sending message so it should also lock it's settings
            return ans;
        }
    }

    async setLocalDescription(ans){
        if(this.peer){
            console.log('ans at peer:',ans);
            await this.peer.setRemoteDescription(ans);
        }

    }

    async getOffer(){
        if(this.peer){
            const offer=await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        }
    }


}

export default new PeerService();

