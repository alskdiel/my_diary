class PostController < ApplicationController

  # GET /post
  def new
    @post = Post.new
    @total_p = Post.all.count
  end

  def edit_post
    post = Post.where(id: params[:id]).take
    new_content = params[:new_content]
    post.update(content: new_content)
    render :text => true
  end

  def create
    if(current_user.posts.exists?(date: params[:date]))
      current_user.posts.find_by(date: params[:date]).update(content: params[:content],
                                                             weather: params[:weather])
    else
      current_user.posts.create(content: params[:content],
                                date: params[:date],
                               weather: params[:weather]) #devise에서 지원하는 기능
    end
    pusher_client = Pusher::Client.new(app_id: '221442',
                                       key: '00789a98227966fd54fc',
                                       secret: '269af179fed6000d430a',
                                       cluster: 'ap1',
                                       encrypted: true);
    pusher_client.trigger('test_channel', 'my_event',
                          {:message => Post.all.count})
  end

  def show
    render :json => current_user.posts.where(date:params[:date]).take
  end

  private
  def post_params
    params.require(:post).permit(:content)
  end

end
