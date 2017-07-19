(function(){

	var app=angular.module("student_module",["service_module" ]);
	app.controller("StudentExamController",function($scope,$rootScope,QuesService,$http){
		//var user=$rootScope.user;
		$scope.userId=userId=0;
		$scope.examName="JAVA MODULE";
		$scope.examId=examId=0;
		$scope.ans=[];//conatins ids and q
		$scope.unans=[];//conatins ids and q
		$scope.all=[];//contains everything
		$scope.response={};//contains ids:ans
		$scope.currentQues={};//contains everything
		$scope.currentQuesType=currentQuesType={'mcq':false,
		'mmcq':false,'fib':false,'mtf':false};
		$scope.tempString='';
		$scope.selQues={"available":[],//contains ids and ques
						"sel":[]};
		$scope.allottedTime=allottedTime=0;
		$scope.startExam=function(){
			//calling QuesService
			$scope.getQuestions();

		};

		$scope.helperForMmcq =function(){
			let tempAns=[];
			$scope.currentQues.options.forEach((c)=>{
				if(c.sel)tempAns.push(c.id);
			});
			$scope.respond($scope.currentQues.id,tempAns);
		}

		$scope.setCurrQType=function(){
			var ty=$scope.currentQues.type;
			for(const key of Object.keys(currentQuesType)){
				if(key===ty){
					currentQuesType[key]=true;
					//if(key=='mmcq'){
						// let tempAns=[];
						// $scope.currentQues.options.forEach((c)=>{
						// 	if(c.sel)tempAns.push(c.id)
						// });
						//$scope.respond($scope.currentQues.id,tempAns);

					//}
					// else if(key=='fib'){
					// 	$scope.respond($scope.currentQues.id,tempString);
					// 	console.log(tempString);
					// }
					if(key==='mtf'){
						let tempAns=[];
						$scope.currentQues.options.forEach((c)=>{
							let y={};y.id=c.id;y.match='';tempAns.push(y);
						});
						
					}
				}
				else{
					currentQuesType[key]=false;
				}
			}
			//console.log($scope.currentQuesType);
		}

		$scope.getQuestions=function(){
			//console.log('hi');
			QuesService.getQuestions(examId).then(function(result){
				allottedTime=result.data.duration*60;
				$scope.all=result.data.questions;
				console.log($scope.all);
				$scope.all.forEach(function(a){
					if(a.type==='mmcq'){
						a.options.map(function(obj){
							let y=obj;
							y.sel=false;
							return y;
						});
					}
				});

				//console.log($scope.all);
				$scope.unans=$scope.all.map(function(obj){
					let y={};
					y["id"]=obj.id;
					y["q"]=obj.q;
					return y;
				});
				$scope.currentQues=$scope.all.filter(function(obj){
					return obj.id===1;
				})[0];
				$scope.setCurrQType();
				$scope.selQues.available=$scope.unans;
				$(document).ready(function() {
					$('select').material_select();
				});
				$scope.$broadcast('start_exam_evt',allottedTime);

				//console.log($scope.unans);
				//console.log($scope.currentQues);
			});


		};

	  //   $scope.$watch('currentQues.options|filter:{selected:true}', function (nv) {
			// var ar=[];
			// nv.forEach((c)=>ar.push(c.id));
			// $scope.respond(currentQues.id,ar)
	  //   }, true);

		$scope.respond=function(quesId,resp){
			switch($scope.currentQues.type){
				case 'mmcq':
				var idx=-1;
				$scope.ans.forEach(function(c,index){
					if(c.id===quesId){
						idx=index;
						//break;
					}
				});
				if(resp.length===0){

					if(idx!=-1){
						$scope.ans.splice(idx,1);
						let y={};
						y["id"]=$scope.currentQues.id;
						y["q"]=$scope.currentQues.q;
						$scope.unans.push(y);
					}
				}

				else{
					$scope.response[quesId]=resp;
					if(idx===-1){
						let y={};
						y.id=quesId;
						y.q=$scope.currentQues.q;
						//console.log(y);
						$scope.ans.push(y);
					}
					//console.log($scope.ans);
					var idx=-1;
					$scope.unans.forEach(function(c,index){if(c.id===quesId)idx=index;});
					if(idx!=-1)$scope.unans.splice(idx,1);

				}
				break;
				case 'mcq':
				$scope.response[quesId]=resp;
				var idx=-1;
				$scope.unans.forEach(function(c,index){
					if(c.id===quesId){
						idx=index;
						//break;
					}
				});
				if(idx!=-1){
					$scope.unans.splice(idx,1);
					let y={};
					y["id"]=$scope.currentQues.id;
					y["q"]=$scope.currentQues.q;
					$scope.ans.push(y);
				}
				break;
				case 'fib':
				$scope.tempString=resp;
				 $(document).ready(function() {
				    Materialize.updateTextFields();
				  });
				var idx=-1;
				$scope.ans.forEach(function(c,index){
					if(c.id===quesId){
						idx=index;
						//break;
					}
				});
				$scope.response[quesId]=resp;

				if(resp===''){
					var idx=-1;
					$scope.ans.forEach(function(c,index){
						if(c.id===quesId){
							idx=index;
							//break;
						}
					});
					if(idx!=-1){
						$scope.ans.splice(idx,1);
						let y={};
						y["id"]=$scope.currentQues.id;
						y["q"]=$scope.currentQues.q;
						$scope.unans.push(y);
					}
				}

				else{
					if(idx===-1){
						let y={};
						y.id=quesId;
						y.q=$scope.currentQues.q;
						//console.log(y);
						$scope.ans.push(y);
					}
					//console.log($scope.ans);
					var idx=-1;
					$scope.unans.forEach(function(c,index){if(c.id===quesId)idx=index;});
					if(idx!=-1)$scope.unans.splice(idx,1);
				}
				break;


			}

			//console.log($scope.ans);
			$(document).ready(function() {
				$('select').material_select();
			});
		};

		$scope.showQues=function(option){
			//console.log(option);
			switch(option){
				case 'ans': $scope.selQues.available=$scope.ans;
				break;

				case 'unans': $scope.selQues.available=$scope.unans;
				break;
				case 'all': $scope.selQues.available= $scope.all.map(function(obj){
					let y={};
					y.id=obj.id;
					y.q=obj.q;
					return y;
				});
				//console.log($scope.selQues.available);
				break;
				default:
				//console.log('wrong option');
			}
				$(document).ready(function() {
					$('select').material_select();
				});


		}



		$scope.goToQues=function(qno){
			$scope.currentQues=$scope.all.filter(function(obj){
				return obj.id===qno;
			})[0];
			$scope.setCurrQType();

		};

		$scope.nextQues=function(){
			$(document).ready(function() {
				Materialize.updateTextFields();
			});
			var idx=$scope.currentQues.id;
			if(idx<$scope.all.length){
				$scope.currentQues=$scope.all.filter(function(obj){
					return obj.id===(idx+1);
				})[0];
				$scope.setCurrQType();
			}
			//console.log($scope.currentQues);
		}

		$scope.prevQues=function(){
			$(document).ready(function() {
				Materialize.updateTextFields();
			});
			var idx=$scope.currentQues.id;
			//console.log(idx);
			if(idx>1){
				$scope.currentQues=$scope.all.filter(function(obj){
					return obj.id===(idx-1);
				})[0];

				$scope.setCurrQType();
			}
		};

		$scope.submitExam=function(){
			QuesService.submitResponse($scope.response,userId,examId).then(function(result){
			var obj=result.data;
			console.log(obj);
			obj.examsEligible.map(function(c){
				if(c.id===examId){
					let y=c;
					y.responses=$scope.response;
					return y;
				}
			});
			$http.put("http://localhost:3000/users/"+userId,obj);
			alert('Exam Finished');
			});

		}


	});

	app.controller("TimerController",function($scope,$interval){
	   //  var stop;
	   //  $scope.timeLeft=0;
	    $scope.$on("start_exam_evt",function(evt,allottedTime){
	    //$scope.timeLeft=allottedTime; //in sec
	   //  $scope.seconds=$scope.timeLeft%60;
	   //  $scope.mins=Math.floor($scope.timeLeft/60); 
	    $scope.startTimer(allottedTime);
	    });


	   //  $scope.startTimer = function() {
	   //    // Don't start a new fight if we are already fighting
	   //    if ( angular.isDefined(stop) ) return;

	   //    stop = $interval(function() {
	   //      if ($scope.timeLeft> 0) {
				// $scope.timeLeft-=1
				// $scope.seconds=$scope.timeLeft%60;
				// $scope.mins=Math.floor($scope.timeLeft/60);
	   //      } else {
	   //        $scope.stopTimer();
	   //      }
	   //    }, 1000);
	   //  };

	   //  $scope.stopFight = function() {
	   //    if (angular.isDefined(stop)) {
	   //      $interval.cancel(stop);
	   //      stop = undefined;
	   //    }
	   //  }

	   $scope.startTimer=function(allottedTime){
			var clock=new FlipClock($('.my-clock'),allottedTime,{
		   		clockFace:'MinuteCounter',
		   		callbacks:{
		   			interval:function(){
		   				var time=this.factory.getTime().time;
		   				if(!time)
		   					$scope.submitExam();
		   			}
		   		},
		   		autoStart:false,
		   		countdown:true
		   		
	   });	   

		   clock.setCountdown(true);
		   clock.start(function(){});
		   //console.log(clock.getFaceValue());
	   }

});
})();