pipeline {
  agent {
    docker { image 'node:lts-alpine' }
  }
  stages {
    stage('Build') {
      steps {
        sh '''yarn install --frozen-lockfile'''
        sh '''yarn run build'''
      }
    }
    stage('Test') {
      steps {
        echo 'Testing'
      }
    }
    stage('Lint') {
      steps {
        echo 'Linting'
      }
    }
    stage('Deploy for development') {
      when {
        branch 'master'
      }
      steps {
        sh '''yarn run build'''
        script {
          def remote_dev = [:]
          remote_dev.name = "wsodev"
          remote_dev.host = "wso-dev.williams.edu"
          remote_dev.port = 22
          remote_dev.allowAnyHosts = true

          withCredentials([usernamePassword(credentialsId: 'wsodev_ssh_server', passwordVariable: 'SSH_PASS', usernameVariable: 'SSH_USER')]) {
            remote_dev.user = SSH_USER
            remote_dev.password = SSH_PASS

            sshRemove remote: remote_dev, path: '/home/wsodev/wso-react/build'
            sshPut remote: remote_dev, from: 'build', into: '/home/wsodev/wso-react/build'
          }
        }
        script {
          try {
            new URL("https://wso-dev.williams.edu").getText()
            return true
          } catch (Exception e) {
            return false
          }
        }
      }
      post {
        success {
          slackSend (color: '#00FF00', message: "WSO-React Deployed on Development\n Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
      }
    }
    stage('Deploy for production') {
          when {
            branch 'production'
          }
          steps {
            sh '''yarn run build'''
            script {
              def remote_dev = [:]
              remote_dev.name = "wso"
              remote_dev.host = "wso.williams.edu"
              remote_dev.port = 22
              remote_dev.allowAnyHosts = true

              withCredentials([usernamePassword(credentialsId: 'wso_ssh_server', passwordVariable: 'SSH_PASS', usernameVariable: 'SSH_USER')]) {
                remote_dev.user = SSH_USER
                remote_dev.password = SSH_PASS

                sshRemove remote: remote_dev, path: '/home/wso/wso/wso-react/build'
                sshPut remote: remote_dev, from: 'build', into: '/home/wso/wso/wso-react/build'
              }
            }
            script {
              try {
                new URL("https://wso.williams.edu").getText()
                return true
              } catch (Exception e) {
                return false
              }
            }
          }
          post {
            success {
              slackSend (color: '#00FF00', message: "WSO-React Deployed on Production\n Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
            }
          }
        }
  }
  options { buildDiscarder(logRotator(numToKeepStr: '2')) }
  post {
    cleanup {
      cleanWs()
    }
  }
}
