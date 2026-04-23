using FlashcardAPI.Data;
using FlashcardAPI.IRepository;
using FlashcardAPI.Models;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.EntityFrameworkCore.Update.Internal;
using System.Collections.Generic;
using System.Linq; 
using Microsoft.EntityFrameworkCore;

namespace FlashcardAPI.Repository
{
    public class FlashcardDAL : IFlashcard
    {
        private readonly FlashcardContext _context;
        private readonly IConfiguration _config;

        public FlashcardDAL(FlashcardContext Context, IConfiguration config)
        {
            _context = Context;
            _config = config;

        }



        #region Get All Users Method
        public List<User> GetAllUsers()
        {
            try
            {
                // Simple: use _context and convert to list
                var userList = _context.Users.ToList();
                return userList.Count == 0 ? null : userList;
            }
            catch (Exception ex)
            {
                Console.WriteLine("GetAllUsers --- " + ex.Message);
                throw;
            }
        }
        #endregion

        #region Get login details for testing
        public async Task<Login> GetLogin(int userID)
        {
            try
            {
                // Use _context and Async version
                return await _context.Logins.FirstOrDefaultAsync(x => x.UserId == userID) ?? new Login();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return new Login();
            }
        }
        #endregion

        #region Login User Method
        public async Task<LoginResponseModel> LoginUser(LoginModel data)
        {
            LoginResponseModel res = new LoginResponseModel();
            try
            {
                if (data != null)
                {
                    // Use _context and FirstOrDefaultAsync
                    var query = await _context.Logins
                        .FirstOrDefaultAsync(x => x.Username == data.Username && x.Password == data.Password);

                    if (query != null)
                    {
                        res.Status = true;
                        res.StatusCode = 200;
                        res.Message = "Login Success";
                        res.IsLoggedIn = true;

                        var user = await _context.Users.FirstOrDefaultAsync(x => x.UserId == query.UserId);
                        if (user != null)
                        {
                            res.UserData = user;
                            return res;
                        }
                    }
                    else
                    {
                        res.Status = false;
                        res.StatusCode = 401; // 401 is more accurate for bad login
                        res.Message = "Login Failed";
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("LoginUser --- " + ex.Message);
                res.Status = false;
                res.StatusCode = 500;
            }
            return res;
        }
        #endregion

        #region GetAllSets
        public async Task<SetsResponseModel> GetAllSets()
        {
            SetsResponseModel res = new SetsResponseModel();
            try
            {
                // Use _context
                var setList = await _context.Sets.ToListAsync();
                res.setList = setList;
                res.Status = true;
                res.StatusCode = 200;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Get all sets error --- " + ex.Message);
                res.Status = false;
                res.StatusCode = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region GetSetInfo
        public async Task<SetInfoResponseModel> GetSetInfo(int setId)
        {
            SetInfoResponseModel res = new SetInfoResponseModel();
            try
            {
                if (setId != 0)
                {
                    // Use _context and async
                    var set = await _context.Sets.FirstOrDefaultAsync(x => x.SetId == setId);
                    if (set != null)
                    {
                        res.setInfo = set;
                        res.Status = true;
                        res.StatusCode = 200;
                        res.Message = "success";
                    }
                }
                else
                {
                    res.Message = "id not found";
                    res.Status = false;
                    res.StatusCode = 400;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Get set info error --- " + ex.Message);
                res.Status = false;
                res.StatusCode = 500;
            }
            return res;
        }
        #endregion


        #region Get cards in a set
        public async Task<CardsResponseModel> GetCardInSet(int setId)
        {
            CardsResponseModel res = new CardsResponseModel();
            try
            {
                // setId is an int, so it can't be null, but we check if it's valid (> 0)
                if (setId > 0)
                {
                    var setInfo = await _context.Sets.FirstOrDefaultAsync(x => x.SetId == setId);
                    var cards = await _context.Cards.Where(x => x.SetId == setId).ToListAsync();

                    if (setInfo != null)
                    {
                        res.SetName = setInfo.SetTitle;
                        res.cardsList = cards;
                        res.Status = true;
                        res.StatusCode = 200;
                        res.Message = "success";
                    }
                }
                else
                {
                    res.Status = false;
                    res.StatusCode = 400;
                    res.Message = "Invalid Set ID";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Get card in set --- " + ex.Message);
                res.Status = false;
                res.StatusCode = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region Edit Sets 1
        public async Task<SetInfoResponseModel> EditSetInfo(Set newSetInfo)
        {
            SetInfoResponseModel res = new SetInfoResponseModel();
            try
            {
                var set = await _context.Sets.FirstOrDefaultAsync(x => x.SetId == newSetInfo.SetId);
                if (set != null)
                {
                    set.SetTitle = newSetInfo.SetTitle;
                    set.SetDescription = newSetInfo.SetDescription;

                    await _context.SaveChangesAsync();

                    res.setInfo = set;
                    res.Status = true;
                    res.StatusCode = 200;
                    res.Message = "success";
                }
            }
            catch (Exception ex)
            {
                res.Status = false;
                res.StatusCode = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region Edit Card
        public async Task<CardResponseModel> EditCardInfo(Card newCardInfo)
        {
            CardResponseModel res = new CardResponseModel();
            try
            {
                var cardInfo = await _context.Cards.FirstOrDefaultAsync(x => x.CardId == newCardInfo.CardId);
                if (cardInfo != null)
                {
                    cardInfo.CardFront = newCardInfo.CardFront;
                    cardInfo.CardBack = newCardInfo.CardBack;
                    cardInfo.Starred = newCardInfo.Starred;

                    await _context.SaveChangesAsync();

                    res.Card = cardInfo;
                    res.Status = true;
                    res.StatusCode = 200;
                    res.Message = "success";
                }
            }
            catch (Exception ex)
            {
                res.Status = false;
                res.StatusCode = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region Add Card
        public async Task<CardResponseModel> AddCard(Card inputCard)
        {
            CardResponseModel res = new CardResponseModel();
            try
            {
                if (inputCard != null)
                {
                    _context.Cards.Add(inputCard);
                    await _context.SaveChangesAsync();

                    res.Card = inputCard;
                    res.Status = true;
                    res.StatusCode = 200;
                    res.Message = "success";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Add card dal --- " + ex.Message);
                res.Status = false;
                res.StatusCode = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region Add Set
        public async Task<SetInfoResponseModel> AddSet(Set inputSet)
        {
            SetInfoResponseModel res = new SetInfoResponseModel();
            try
            {
                if (inputSet != null)
                {
                    _context.Sets.Add(inputSet);
                    await _context.SaveChangesAsync();

                    res.setInfo = inputSet;
                    res.Status = true;
                    res.StatusCode = 200;
                    res.Message = "success";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("add set dal--- " + ex.Message);
                res.Status = false;
                res.StatusCode = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region Get Sets in user account
        public async Task<SetsResponseModel> GetSetsInUserAccount(int userId)
        {
            SetsResponseModel res = new SetsResponseModel();
            try
            {
                if (userId > 0)
                {
                    var setList = await _context.Sets.Where(x => x.UserId == userId).ToListAsync();

                    res.setList = setList;
                    res.Status = true;
                    res.StatusCode = 200;
                    res.Message = "success";
                }
                else
                {
                    res.Status = false;
                    res.StatusCode = 400;
                    res.Message = "Invalid User ID";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Get set in user acc --- " + ex.Message);
                res.Status = false;
                res.StatusCode = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region Get Folders in user account
        public async Task<FoldersResponseModel> GetFoldersInUserAccount(int userId)
        {
            FoldersResponseModel res = new FoldersResponseModel();
            try
            {
                // int cannot be null, so we check if it's a valid ID
                if (userId > 0)
                {
                    var folderList = await _context.Folders.Where(x => x.UserId == userId).ToListAsync();

                    if (folderList.Any())
                    {
                        res.Folders = folderList;
                        res.Status = true;
                        res.StatusCode = 200;
                        res.Message = "success";
                    }
                }
                else
                {
                    res.Status = false;
                    res.StatusCode = 400;
                    res.Message = "Invalid User ID";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Get folder in user acc --- " + ex.Message);
                res.Status = false;
                res.StatusCode = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region Get Sets on user account
        public async Task<SetInfoModel> GetSetsOnUserAccount(int userId)
        {
            SetInfoModel res = new SetInfoModel();
            try
            {
                var setList = await _context.Sets.Where(x => x.UserId == userId).ToListAsync();
                var findUser = await _context.Logins.FirstOrDefaultAsync(x => x.UserId == userId);

                if (setList.Any() && findUser != null)
                {
                    res.Data = new List<SetData>();
                    foreach (var set in setList)
                    {
                        SetData setData = new SetData
                        {
                            SetId = set.SetId,
                            UserId = userId,
                            SetTitle = set.SetTitle,
                            SetDescription = set.SetDescription,
                            UserName = findUser.Username,
                            // Direct count from DB
                            CardCount = await _context.Cards.CountAsync(x => x.SetId == set.SetId)
                        };

                        var folderIds = await _context.SetFolders
                            .Where(x => x.SetId == set.SetId)
                            .Select(x => x.FolderId)
                            .ToListAsync();

                        setData.FolderConnection = folderIds.Any() ? folderIds : new List<int> { 0 };
                        res.Data.Add(setData);
                    }
                    res.Status = true;
                    res.StatusCode = 200;
                    res.Message = "success";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Get set in user acc --- " + ex.Message);
                res.Status = false;
                res.StatusCode = 500;
            }
            return res;
        }
        #endregion

        #region Get Folders on user account 
        public async Task<FolderInfoModel> GetFoldersOnUserAccount(int userId)
        {
            FolderInfoModel res = new FolderInfoModel();
            try
            {
                var folderList = await _context.Folders.Where(x => x.UserId == userId).ToListAsync();
                var findUser = await _context.Logins.FirstOrDefaultAsync(x => x.UserId == userId);

                if (folderList.Any() && findUser != null)
                {
                    res.Data = new List<FolderData>();
                    foreach (var folder in folderList)
                    {
                        res.Data.Add(new FolderData
                        {
                            FolderId = folder.FolderId,
                            UserId = userId,
                            FolderTitle = folder.FolderTitle,
                            FolderDescription = folder.FolderDescription,
                            UserName = findUser.Username,
                            SetCount = await _context.SetFolders.CountAsync(x => x.FolderId == folder.FolderId)
                        });
                    }
                    res.Status = true;
                    res.StatusCode = 200;
                    res.Message = "success";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Get folders in user acc --- " + ex.Message);
                res.Status = false;
                res.StatusCode = 500;
            }
            return res;
        }
        #endregion

        #region AddSetToFolder
        public async Task<ResponseModel> AddSetToFolder(int setID, int folderID)
        {
            ResponseModel res = new ResponseModel();
            try
            {
                // Check if both exist
                var setExists = await _context.Sets.AnyAsync(x => x.SetId == setID);
                var folderExists = await _context.Folders.AnyAsync(x => x.FolderId == folderID);

                if (setExists && folderExists)
                {
                    // Check for existing connection
                    var existing = await _context.SetFolders
                        .FirstOrDefaultAsync(x => x.FolderId == folderID && x.SetId == setID);

                    if (existing == null)
                    {
                        _context.SetFolders.Add(new SetFolder { SetId = setID, FolderId = folderID });
                        await _context.SaveChangesAsync();

                        res.Status = true;
                        res.StatusCode = 200;
                        res.Message = "success";
                    }
                    else
                    {
                        res.Status = false;
                        res.StatusCode = 400;
                        res.Message = "Connection already exists";
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Add set to folder error --- " + ex.Message);
                res.Status = false;
                res.StatusCode = 500;
            }
            return res;
        }
        #endregion
        #region Get folder sets 1
        public async Task<SetInfoModel> GetFolderSets(int folderId)
        {
            SetInfoModel res = new SetInfoModel();
            try
            {
                var folder = await _context.Folders.FirstOrDefaultAsync(x => x.FolderId == folderId);
                if (folder == null) return new SetInfoModel { Status = false, Message = "Folder not found" };

                res.FolderTitle = folder.FolderTitle;
                var setConnections = await _context.SetFolders.Where(x => x.FolderId == folderId).ToListAsync();
                res.Data = new List<SetData>();

                foreach (var connection in setConnections)
                {
                    var set = await _context.Sets.FirstOrDefaultAsync(x => x.SetId == connection.SetId);
                    if (set != null)
                    {
                        var user = await _context.Logins.FirstOrDefaultAsync(x => x.UserId == set.UserId);
                        res.Data.Add(new SetData
                        {
                            SetId = set.SetId,
                            UserId = set.UserId,
                            SetTitle = set.SetTitle,
                            SetDescription = set.SetDescription,
                            UserName = user?.Username ?? "Unknown",
                            CardCount = await _context.Cards.CountAsync(c => c.SetId == set.SetId)
                        });
                    }
                }
                res.Status = true;
                res.StatusCode = 200;
                res.Message = "success";
            }
            catch (Exception ex)
            {
                res.Status = false;
                res.StatusCode = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region Delete Card
        public async Task<CardResponseModel> DeleteCard(int cardId)
        {
            CardResponseModel res = new CardResponseModel();
            try
            {
                var card = await _context.Cards.FirstOrDefaultAsync(x => x.CardId == cardId);
                if (card != null)
                {
                    _context.Cards.Remove(card);
                    await _context.SaveChangesAsync();
                    res.Status = true;
                    res.StatusCode = 200;
                    res.Message = "Card deleted successfully";
                }
                else
                {
                    res.Status = false;
                    res.StatusCode = 404;
                    res.Message = "Card not found";
                }
            }
            catch (Exception ex)
            {
                res.Status = false;
                res.StatusCode = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region Create Set With Card
        public async Task<SetCreationResponseModel> CreateSetWithCard(SetCreationModel inputData)
        {
            SetCreationResponseModel res = new SetCreationResponseModel();
            try
            {
                if (inputData != null)
                {
                    Set newSet = new Set
                    {
                        UserId = inputData.UserID,
                        SetTitle = inputData.SetTitle,
                        SetDescription = inputData.SetDescription
                    };

                    _context.Sets.Add(newSet);
                    await _context.SaveChangesAsync(); // Saves set and populates newSet.SetId

                    if (inputData.CardList != null && inputData.CardList.Any())
                    {
                        foreach (var card in inputData.CardList)
                        {
                            _context.Cards.Add(new Card
                            {
                                SetId = newSet.SetId,
                                CardFront = card.CardFront,
                                CardBack = card.CardBack,
                                Starred = false
                            });
                        }
                        await _context.SaveChangesAsync();
                    }
                    res.Status = true;
                    res.StatusCode = 200;
                    res.Message = "success";
                }
            }
            catch (Exception ex)
            {
                res.Status = false;
                res.StatusCode = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion

        #region Delete folder from set1
        public async Task<FoldersResponseModel> deleteFolderFromSet(int setId, int folderID)
        {
            FoldersResponseModel res = new FoldersResponseModel();
            try
            {
                var connection = await _context.SetFolders.FirstOrDefaultAsync(x => x.SetId == setId && x.FolderId == folderID);
                if (connection != null)
                {
                    _context.SetFolders.Remove(connection);
                    await _context.SaveChangesAsync();
                    res.Status = true;
                    res.StatusCode = 200;
                    res.Message = "success";
                }
            }
            catch (Exception ex)
            {
                res.Status = false;
                res.StatusCode = 500;
            }
            return res;
        }
        #endregion

        #region Delete Set
        public async Task<SetsResponseModel> DeleteSet(int setId)
        {
            SetsResponseModel res = new SetsResponseModel();
            try
            {
                var set = await _context.Sets.FirstOrDefaultAsync(x => x.SetId == setId);
                if (set != null)
                {
                    _context.Sets.Remove(set);
                    await _context.SaveChangesAsync();
                    res.Status = true;
                    res.StatusCode = 200;
                }
            }
            catch (Exception ex)
            {
                res.Status = false;
                res.StatusCode = 500;
            }
            return res;
        }
        #endregion

        #region Delete Folder
        public async Task<ResponseModel> DeleteFolder(int folderId)
        {
            ResponseModel res = new ResponseModel();
            try
            {
                var folder = await _context.Folders.FirstOrDefaultAsync(x => x.FolderId == folderId);
                if (folder != null)
                {
                    _context.Folders.Remove(folder);
                    await _context.SaveChangesAsync();
                    res.Status = true;
                    res.StatusCode = 200;
                }
            }
            catch (Exception ex)
            {
                res.Status = false;
                res.StatusCode = 500;
            }
            return res;
        }
        #endregion

        #region Add Folder
        public async Task<ResponseModel> AddFolder(Folder inputFolder)
        {
            ResponseModel res = new ResponseModel();
            try
            {
                _context.Folders.Add(inputFolder);
                await _context.SaveChangesAsync();
                res.Status = true;
                res.StatusCode = 200;
                res.Message = "success";
            }
            catch (Exception ex)
            {
                res.Status = false;
                res.StatusCode = 500;
            }
            return res;
        }
        #endregion

        #region signup
        public async Task<SignUpModel> SignUp(SignUpData data)
        {
            SignUpModel res = new SignUpModel();
            try
            {
                if (data != null)
                {
                    User user = new User
                    {
                        FirstName = data.firstName,
                        LastName = data.lastName,
                        Email = data.email
                    };

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync(); // ID is generated here

                    Login login = new Login
                    {
                        Username = data.username,
                        Password = data.password,
                        UserId = user.UserId
                    };

                    _context.Logins.Add(login);
                    await _context.SaveChangesAsync();

                    res.UserId = user.UserId;
                    res.Status = true;
                    res.StatusCode = 200;
                    res.Message = "success";
                }
            }
            catch (Exception ex)
            {
                res.Status = false;
                res.StatusCode = 500;
                res.Message = ex.Message;
            }
            return res;
        }
        #endregion



    }
}
