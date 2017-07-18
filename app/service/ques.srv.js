(function(){
	angular.module("service_module").service("QuesService",function($http,$q){
		this.getQuestions=function(examId){
			var deferred=$q.defer();
			$http.get("http://localhost:3000/exam/"+examId).then(function(result){
				deferred.resolve(result);
			},
			function(result){
				deferred.reject(result);
			});
			return deferred.promise;
		} 

		this.submitResponse=function(response,userId,examId){
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