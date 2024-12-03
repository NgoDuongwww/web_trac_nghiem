import { subjects } from "../db/Subjects.js";

import { Students } from "../db/Students.js";

import { ADAV } from "../db/Quizs/ADAV.js";
import { ADBS } from "../db/Quizs/ADBS.js";
import { ADTE } from "../db/Quizs/ADTE.js";
import { ADUI } from "../db/Quizs/ADUI.js";
import { ASNE } from "../db/Quizs/ASNE.js";
import { CLCO } from "../db/Quizs/CLCO.js";
import { DBAV } from "../db/Quizs/DBAV.js";
import { DBBS } from "../db/Quizs/DBBS.js";
import { GAME } from "../db/Quizs/GAME.js";
import { HTCS } from "../db/Quizs/HTCS.js";
import { INMA } from "../db/Quizs/INMA.js";
import { JAAV } from "../db/Quizs/JAAV.js";
import { JABS } from "../db/Quizs/JABS.js";
import { JSPR } from "../db/Quizs/JSPR.js";
import { LAYO } from "../db/Quizs/LAYO.js";
import { MOWE } from "../db/Quizs/MOWE.js";
import { PHPP } from "../db/Quizs/PHPP.js";
import { PMAG } from "../db/Quizs/PMAG.js";
import { Template } from "../db/Quizs/Template.js";
import { VBPR } from "../db/Quizs/VBPR.js";
import { WEBU } from "../db/Quizs/WEBU.js";

var app = angular.module("myApp", ["ngRoute"]);

const questionsBySubject = {
  ADAV: ADAV,
  ADBS: ADBS,
  ADTE: ADTE,
  ADUI: ADUI,
  ASNE: ASNE,
  CLCO: CLCO,
  DBAV: DBAV,
  DBBS: DBBS,
  GAME: GAME,
  HTCS: HTCS,
  INMA: INMA,
  JAAV: JAAV,
  JABS: JABS,
  JSPR: JSPR,
  LAYO: LAYO,
  MOWE: MOWE,
  PHPP: PHPP,
  PMAG: PMAG,
  Template: Template,
  VBPR: VBPR,
  WEBU: WEBU,
};

app.config(function ($routeProvider) {
  $routeProvider
    .when("/Layout/header", {
      templateUrl: "Layout/header.html",
      controller: "menuCtrl",
    })
    .when("/Layout/footer", {
      templateUrl: "Layout/footer.html",
    })
    .when("/Test/test/:subjectId", {
      templateUrl: "Test/test.html",
      controller: "testCtrl",
    })
    .when("/Test/do_test/:subjectId", {
      templateUrl: "Test/do_test.html",
      controller: "doTestCtrl",
      // resolve: {
      //   auth: function ($location) {
      //     const loggedInUser = JSON.parse(localStorage.getItem("loggenIn"));
      //     if (!loggedInUser) {
      //       alert("Login before taking the test");
      //       $location.path("/Layout/menu/login");
      //     }
      //   },
      // },
    })
    .when("/Layout/home", {
      templateUrl: "Layout/home.html",
    })
    .when("/Layout/menu/introduce", {
      templateUrl: "Layout/menu/introduce.html",
    })
    .when("/Test/test", {
      templateUrl: "Test/test.html",
    })
    .when("/Layout/menu/certification", {
      templateUrl: "Layout/menu/certification.html",
    })
    .when("/Layout/menu/login", {
      templateUrl: "Layout/menu/login.html",
    })
    .when("/Layout/menu/register", {
      templateUrl: "Layout/menu/register.html",
    })
    .when("/Layout/menu/forgotPassword", {
      templateUrl: "Layout/menu/forgotPassword.html",
    })
    .otherwise({
      redirectTo: "/Layout/home",
    });
});

app.controller("testCtrl", function ($scope, $routeParams, $location) {
  $scope.subjects = subjects;
  // $scope.selectedSubjectId = $routeParams.subjectId;
  // $scope.selectSubject = function (subjectId) {
  //   $location.path("/Test/test/" + subjectId);
  // };
  $scope.goToTest = function (subjectId) {
    $location.path(`/Test/do_test/${subjectId}`);
  };
  // $scope.selectedSubject = $scope.subjects.find(function (subject) {
  //   return subject.Id === $scope.selectedSubjectId;
  // });
});

app.controller("doTestCtrl", function ($scope, $routeParams, $location) {
  // const loggedInUser = JSON.parse(localStorage.getItem("loggenIn"));
  // if (!loggedInUser) {
  //   alert("Login before taking the test");
  //   $location.path("/Layout/menu/login");
  // }
  // $scope.loggedInUser = loggedInUser;
  
  const subjectId = $routeParams.subjectId;
  const questions = questionsBySubject[subjectId];
  if (!questions) {
    alert("Subject not found");
    return;
  }
  $scope.subjects = subjects;

  // Shuffle questions and answers once during initialization
  const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
  shuffledQuestions.forEach(function (question) {
    question.answers = question.Answers.sort(() => 0.5 - Math.random());
  });
  $scope.questions = shuffledQuestions;

  $scope.pageSize = 10;
  $scope.currentPage = 0;

  // Get questions for the current page without reshuffling
  $scope.getQuestionsForPage = function () {
    const startIndex = $scope.currentPage * $scope.pageSize;
    const endIndex = startIndex + $scope.pageSize;
    return $scope.questions.slice(startIndex, endIndex);
  };

  $scope.showPages = function () {
    return Math.ceil($scope.questions.length / $scope.pageSize);
  };

  $scope.next = function (event) {
    event.preventDefault();
    if (($scope.currentPage + 1) * $scope.pageSize < $scope.questions.length) {
      $scope.currentPage++;
    }
  };

  $scope.prevPage = function (event) {
    event.preventDefault();
    if ($scope.currentPage > 0) {
      $scope.currentPage--;
    }
  };

  $scope.submitTest = function () {
    let score = 0;
    $scope.questions.forEach(function (question) {
      if (question.userAnswer !== undefined && question.userAnswer !== null) {
        if (String(question.userAnswer) === String(question.AnswerId)) {
          score++;
        }
      }
    });
    var ket__qua = document.getElementById("ket__qua");
    ket__qua.innerHTML =
      "Điểm của bài test: " + score + " / " + $scope.questions.length;
    ket__qua.style.display = "block";
  };
});

app.controller("loginCtrl", function ($scope, $location) {
  $scope.loginData = {
    username: "",
    password: "",
  };
  $scope.errorMessage = "";
  $scope.Students = Students; // Đảm bảo Students đã được khởi tạo hoặc tải từ API

  // Hàm kiểm tra thông tin đăng nhập
  function authenticateUser(username, password) {
    if ($scope.Students && $scope.Students.length > 0) {
      return $scope.Students.find(function (student) {
        return student.username === username && student.password === password;
      });
    }
    return null;
  }

  $scope.login = function () {
    var username = $scope.loginData.username;
    var password = $scope.loginData.password;

    var student = authenticateUser(username, password);
    if (student) {
      localStorage.setItem("loggedIn", JSON.stringify(student));
      $scope.errorMessage = "";
      $location.path("/Layout/home");
    } else if (!$scope.Students || $scope.Students.length === 0) {
      $scope.errorMessage = "Dữ liệu sinh viên chưa được tải.";
    } else {
      $scope.errorMessage = "Sai tài khoản hoặc mật khẩu.";
    }
  };
});

app.controller("registerCtrl", function ($scope) {
  const storedStudents = JSON.parse(localStorage.getItem("Students")) || [];

  $scope.students = storedStudents;
  $scope.registerData = {
    username: "",
    password: "",
    confirmPassword: "",
  };

  $scope.errorMessage = "";
  $scope.successMessage = "";

  $scope.register = function () {
    const { username, password, confirmPassword } = $scope.registerData;

    // Kiểm tra dữ liệu nhập
    if (!username || !password || !confirmPassword) {
      $scope.errorMessage = "Vui lòng nhập đầy đủ thông tin.";
      return;
    }

    if (password !== confirmPassword) {
      $scope.errorMessage = "Mật khẩu không khớp.";
      return;
    }

    // Kiểm tra trùng lặp tài khoản
    const existingUser = $scope.students.filter(
      (students) => students.username === username
    );
    if (existingUser.length > 0) {
      $scope.errorMessage = "Tên đăng nhập đã tồn tại.";
      $scope.successMessage = "";
      return;
    }

    // Tạo sinh viên mới với dữ liệu mặc định
    const newStudents = {
      username,
      password,
      fullname: "Chưa cập nhật",
      email: "Chưa cập nhật",
      gender: "true",
      birthday: "Chưa cập nhật",
      schoolfee: "0",
      marks: "0",
    };

    $scope.students.push(newStudents); // Thêm vào danh sách
    $scope.successMessage = "Đăng ký thành công!";
    $scope.errorMessage = "";

    // Reset form
    $scope.registerData = {
      username: "",
      password: "",
      confirmPassword: "",
    };
  };
});

app.controller("forgotPasswordCtrl", function ($scope) {
  $scope.forgotPasswordData = {
    email: "",
  };
  $scope.errorMessage = "";
  $scope.successMessage = "";
  $scope.password = ""; // Lưu mật khẩu khi tìm thấy email
  $scope.Students = Students; // Dữ liệu sinh viên

  // Hàm xử lý quên mật khẩu
  $scope.forgot = function () {
    var email = $scope.forgotPasswordData.email.trim();

    if ($scope.Students.length > 0) {
      var student = $scope.Students.find(function (student) {
        return student.email === email;
      });

      if (student) {
        // Hiển thị mật khẩu khi tìm thấy tài khoản
        $scope.password = student.password;
        $scope.successMessage = "Tìm thấy tài khoản!";
        $scope.errorMessage = "";
      } else {
        $scope.password = ""; // Xóa thông tin mật khẩu
        $scope.errorMessage = "Không tìm thấy tài khoản với email này.";
        $scope.successMessage = "";
      }
    } else {
      $scope.errorMessage = "Dữ liệu sinh viên chưa được tải.";
      $scope.successMessage = "";
    }
  };
});

app.run(function ($rootScope) {
  $rootScope.$on("$routeChangeStart", function () {
    $rootScope.loading = true;
  });
  $rootScope.$on("$routeChangeSuccess", function () {
    $rootScope.loading = false;
  });
  $rootScope.$on("$routeChangeError", function () {
    $rootScope.loading = false;
    alert("Lỗi, không tải được template");
  });
});

// ===================== ANIME JS =====================
