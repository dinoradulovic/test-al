#!/usr/bin/env bash

THIS_DIR="$(dirname "$0")"
# It gets all the env variables from ENV file
source $THIS_DIR/../../../.env

OLD_CIDR=$(aws ec2 --profile $AWS_PROFILE \
describe-security-groups --filters  Name=group-id,Values=$INSTANCE_SECURITY_GROUP_ID \
--output=text --query 'SecurityGroups[0].IpPermissions[?ToPort==`22`].IpRanges') 

NEW_CIDR=$(curl -s http://checkip.amazonaws.com/)/32

echo Old CIDR: $OLD_CIDR
echo New CIDR: $NEW_CIDR

aws ec2 --profile $AWS_PROFILE \
revoke-security-group-ingress \
--group-id $INSTANCE_SECURITY_GROUP_ID \
--protocol tcp --port 22 --cidr $OLD_CIDR 


aws ec2 --profile $AWS_PROFILE \
    authorize-security-group-ingress \
    --group-id $INSTANCE_SECURITY_GROUP_ID \
    --protocol tcp \
    --port 22 \
    --cidr $NEW_CIDR