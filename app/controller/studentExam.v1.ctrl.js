(function(){

	var app=angular.module("student_module",["service_module"]);
	app.controller("StudentExamController",function($scope,$rootScope,QuesService){
		//var user=$rootScope.user;
		$scope.examName="JAVA MODULE";
		$scope.examId=examId=0;
		$scope.ans=[];//conatins ids and q
		$scope.unans=[];//conatins ids and q
		$scope.all=[];//contains everything
		$scope.response={};//contains ids:ans
		$scope.currentQues={};//contains everything
		$scope.selQues={"available":[],//contains ids and ques
						"sel":[]};
		$scope.allottedTime=allottedTime=0;
		$scope.startExam=function(){
			//calling QuesService
			$scope.getQuestions();

		};

		$scope.getQuestions=function(){
			//console.log('hi');
			QuesService.getQuestions(examId).then(function(result){
				allottedTime=result.data.duration*60;
				$scope.all=result.data.questions;
				//console.log($scope.all);
				$scope.unans=$scope.all.map(function(obj){
					let y={};
					y["id"]=obj.id;
					y["q"]=obj.q;
					return y;
				});
				$scope.currentQues=$scope.all.filter(function(obj){
					return obj.id==1;
				})[0];
				$scope.selQues.available=$scope.unans;
				$(document).ready(function() {
					$('select').material_select();
				});
				$scope.$broadcast('start_exam_evt',allottedTime);

				//console.log($scope.unans);
				//console.log($scope.currentQues);
			});


		};

		$scope.respond=function(quesId,resp){
			$scope.response[quesId]=resp;
			//console.log($scope.response);
			//ans---
			//console.log(quesId);
			$scope.ans=$scope.all.filter(function(obj){
				return obj.id==parseInt(quesId);
			}).map(function(obj){
				let y={};
				y["id"]=obj.id;
				y["q"]=obj.q;
				return y;
			});
			console.log($scope.ans);
			var idx=-1;
			$scope.unans.forEach(function(c,index){
				if(c.id===quesId){
					idx=index;
				}
			});
			if(idx!=-1){

				$scope.unans.splice(idx,1);			
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
				return obj.id==qno;
			})[0];
		};

		$scope.nextQues=function(){
			var idx=$scope.currentQues.id;
			if(idx<$scope.all.length){
				$scope.currentQues=$scope.all.filter(function(obj){
					return obj.id==(idx+1);
				})[0];
			}
			//console.log($scope.currentQues);
		}

		$scope.prevQues=function(){
			var idx=$scope.currentQues.id;
			//console.log(idx);
			if(idx>1){
				$scope.currentQues=$scope.all.filter(function(obj){
					return obj.id==(idx-1);
				})[0];
			}
		};

		$scope.submitExam=function(){
			alert('Exam Finished');
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
		   					alert('fin');
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