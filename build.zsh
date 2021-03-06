
#echo $*
#set
echo dir=$dir

#exec npm test spec/test-spec.js

ln -sfn .. node_modules/uxregexp

if ${build_file:-false}; then
  file=$(realpath $1)
  if [[ $(basename $file) == *-spec.js ]]; then
    npm run test-file $file
    exit
  fi
  echo cannot build file $1
  exit
fi

npm test
#js test.js
