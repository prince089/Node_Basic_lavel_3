angular.module('TaskApp', [])
  .controller('TaskController', function ($scope, $http) {
    // Initialize tasks and the new task object
    $scope.tasks = [];
    $scope.newTask = {};
    $scope.editingTask = null;

    // Function to fetch tasks from the server
    $scope.getTasks = function () {
      $http.get('/api/tasks')
        .then(function (response) {
          $scope.tasks = response.data;
        })
    };

    // Function to add a new task
    $scope.addTask = function () {
      $http.post('/api/tasks', $scope.newTask)
        .then(function (response) {
          $scope.tasks.push(response.data);
          $scope.newTask = {};
        })
    };

    // Function to edit a task
    $scope.editTask = function (task) {
      $scope.editingTask = angular.copy(task);
    };

    // Function to update a task
    $scope.updateTask = function () {
      $http.put('/api/tasks/' + $scope.editingTask._id, $scope.editingTask)
        .then(function (response) {
          const index = $scope.tasks.findIndex(task => task._id === response.data._id);
          if (index !== -1) {
            $scope.tasks[index] = response.data;
          }
          $scope.editingTask = null;
        })
    };

    // Function to cancel editing a task
    $scope.cancelEdit = function () {
      $scope.editingTask = null;
    };

    // Function to delete a task
    $scope.deleteTask = function (task) {
      console.log(task)
      $http.delete('/api/tasks/'+task)
        .then(function (response) {
          $scope.tasks = response.data
          $scope.getTasks();
        })
    };

    // Initial fetch of tasks
    $scope.getTasks();
  });