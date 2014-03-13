require 'sinatra'
require 'json'

words = File.readlines('/usr/share/dict/cracklib-small').map(&:chomp)

get '/words' do
  content_type :json
  word = request['word']

  suggestions = words.lazy.select { |w| w.start_with?(word) }.take(5).to_a

  if request['slow']
    sleep(rand(0.5..3.0))
  end

  response['Access-Control-Allow-Origin'] = '*'
  {word: word, suggestions: suggestions}.to_json
end
