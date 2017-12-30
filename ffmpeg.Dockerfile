FROM ubuntu:17.10

RUN apt-get update && apt-get -y install wget python git automake libtool build-essential cmake libglib2.0-dev closure-compiler git

RUN useradd -c 'Usa' -m -d /home/u -s /bin/bash u
USER u
#SHELL ["/bin/bash", "-c"] 
WORKDIR /home/u

RUN wget https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz
RUN tar xzvf emsdk-portable.tar.gz
WORKDIR /home/u/emsdk-portable
RUN ./emsdk update
RUN ./emsdk install latest
RUN ./emsdk activate latest

WORKDIR /home/u
RUN git clone https://github.com/Kagami/ffmpeg.js.git
WORKDIR /home/u/ffmpeg.js
RUN git submodule init && git submodule update --recursive # sobmodules!

RUN sed -ri \
	-e 's/^EMCC_COMMON_ARGS = /& -s ALLOW_MEMORY_GROWTH=1/' \
	-e 's/^COMMON_FILTERS = /& trunc/' \
	#-e 's/^COMMON_DEMUXERS = .*$/COMMON_EDEMUXERS = matroska mov image2 mpegps concat gif/' \
	-e 's/^COMMON_DEMUXERS = /& gif /' \
	-e 's/^COMMON_DECODERS = /& gif /' \
#	-e '/^COMMON_DECODERS/ { :c; /\\$/ { n; bc; }; s/^.*$/COMMON_DECODERS = vp8 vp9 gif theora mpeg2video mpeg4 h264 hevc/; };' \
	#-e 's/^MP4_MUXERS = .*$/MP4_MUXERS = mp4 null/' \
	#-e 's/^MP4_ENCODERS = .*$/MP4_ENCODERS = mp4/' \
	#-e '/^MP4_SHARED_DEPS/ { :c; /\\$/ { n; bc; }; s/\n[^\n]*libmp3lame.so//; };' \
	-e 's/ -j8 / -j2 /;' \
	Makefile
RUN bash -c '. ../emsdk-portable/emsdk_env.sh && make ffmpeg-worker-mp4.js'
