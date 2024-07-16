cd terraform/environments/$1

cd remote-state
terraform init && terraform apply -auto-approve

cd .. 
terraform init && terraform apply -auto-approve

cd ../../../
pwd

executeSls () {
   pwd
   npx serverless deploy --stage $1
}

cd auth/
executeSls $1
