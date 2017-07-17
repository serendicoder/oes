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
	});
})();