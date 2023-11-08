class MicropostsController < ApplicationController
    # 新しいMicropostを作成
    def create
      @micropost = Micropost.new(micropost_params)
      if @micropost.save
        redirect_to @micropost, notice: 'Micropostが正常に作成されました。'
      else
        render :new
      end
    end
  
    # すべてのMicropostを表示
    def index
      @microposts = Micropost.all
    end
  
    # 特定のMicropostを表示
    def show
      @micropost = Micropost.find(params[:id])
    end
  
    private
  
    def micropost_params
      params.require(:micropost).permit(:title, :image)
    end
  end
  