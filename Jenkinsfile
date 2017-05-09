pipeline {
  agent any
  stages {
    stage('Initialize') {
      steps {
        parallel(
          "Initialize": {
            echo 'Hello World'
            
          },
          "": {
            echo 'message 2'
            
          }
        )
      }
    }
  }
}