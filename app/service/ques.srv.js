(function(){
	angular.module("service_module").service("QuesService",function($http,$q){
		var QuesService=this;
		QuesService.getQuestions=function(examId){
			var deferred=$q.defer();
			$http.get("http://localhost:3000/exam/"+examId).then(function(result){
				deferred.resolve(result);
			},
			function(result){
				deferred.reject(result);
			});
			return deferred.promise;
		} 

		QuesService.calculateResult=function(all,response,userId,examId){

			QuesService.submitResponse(response,userId,examId).then(function(result){
			var marksObtained=0;
			all.forEach(function(c){
				if(c.type==='mmcq'){
					if(response[c.id]!=null && (c.id in response)){
						var x=response[c.id].sort();
						var y=c.correct.sort();
						console.log(x);
						console.log(y);
						for(var i=0;i<y.length;i++){
							if(x[i]===y[i]){
								marksObtained+=c.marks;
							}
						}
					}
				}
				else if(c.type==='fib'){
					console.log(response[c.id]);
					console.log(c.correct);
					if(response[c.id]!=null && (c.id in response)){
						if(response[c.id].toUpperCase()===c.correct.toUpperCase()){
							marksObtained+=c.marks;
						}	
					}

				}

				else{
					if(response[c.id]!=null && (c.id in response)){
						if(response[c.id]===c.correct){
							marksObtained+=c.marks;
						}
					}

				}

			});
			var obj=result.data;
			console.log(obj);
			obj.examsEligible.map(function(c){
				if(c.id===examId){
					let y=c;
					y.responses=response;
					y.marksObtained=marksObtained;
					return y;
				}
			});
			$http.put("http://localhost:3000/users/"+userId,obj).then(function(){
				alert('Exam Finished');

				});
			});

		}

		QuesService.submitResponse=function(response,userId,examId){
			var deferred=$q.defer();
			$http.get("http://localhost:3000/users/"+userId).then(function(result){
				deferred.resolve(result);
			},
			function(result){
				deferred.reject(result);
			});
			return deferred.promise;
			//console.log(deferred.promise.data);
			// var obj=deferred.promise.data;
			// obj.examsEligible.map(function(c){
			// 	if(c.id===examId){
			// 		let y=c;
			// 		y.response=response;
			// 		return y;
			// 	}
			// });
			// $http.put("http://localhost:3000/users"+userId,obj);


		}
	});
})();